package watcher

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"postgresql-cluster-console/internal/configuration"
	"postgresql-cluster-console/internal/storage"
	"postgresql-cluster-console/internal/xdocker"
	"postgresql-cluster-console/pkg/tracer"
	"sync"
	"time"

	"github.com/mitchellh/mapstructure"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

type LogWatcher interface {
	Run()
	Stop()
}

type logWatcher struct {
	db            storage.IStorage
	dockerManager xdocker.IManager
	isRun         bool
	log           zerolog.Logger
	cfg           *configuration.Config

	ctx  context.Context
	done context.CancelFunc
	wg   sync.WaitGroup
}

func NewLogWatcher(db storage.IStorage, dockerManager xdocker.IManager, cfg *configuration.Config) LogWatcher {
	return &logWatcher{
		db:            db,
		dockerManager: dockerManager,
		cfg:           cfg,
		log:           log.Logger.With().Str("module", "log_watcher").Logger(),
	}
}

func (lw *logWatcher) Run() {
	if lw.isRun {
		return
	}
	lw.isRun = true

	lw.ctx, lw.done = context.WithCancel(context.Background())
	lw.wg.Add(1)
	go func() {
		lw.loop()
		lw.wg.Done()
	}()
	lw.log.Info().Msg("run")
}

func (lw *logWatcher) Stop() {
	lw.log.Info().Msg("stopping")
	lw.done()
	lw.wg.Wait()
	lw.isRun = false
	lw.log.Info().Msg("stopped")
}

func (lw *logWatcher) loop() {
	timer := time.NewTimer(lw.cfg.LogWatcher.RunEvery)
	defer timer.Stop()

	for {
		select {
		case <-lw.ctx.Done():
			lw.log.Info().Msg("loop is done")

			return
		case <-timer.C:
			lw.doWork()
			timer.Reset(lw.cfg.LogWatcher.RunEvery)
		}
	}
}

func (lw *logWatcher) doWork() {
	lw.log.Debug().Msg("starting to collect info about operations performed on clusters")
	operations, err := lw.db.GetInProgressOperations(lw.ctx, time.Now().Add(-lw.cfg.LogWatcher.AnalyzePast))
	if err != nil {
		lw.log.Error().Err(err).Msg("failed to get in_progress operations")

		return
	}
	for _, op := range operations {
		localLog := lw.log.With().Str("cid", op.Cid).Int64("operation_id", op.ID).Logger()
		localLog.Trace().Msg("starting to collect info")

		opCtx := context.WithValue(lw.ctx, tracer.CtxCidKey{}, op.Cid)
		containerStatus, err := lw.dockerManager.GetStatus(opCtx, xdocker.InstanceID(op.DockerCode))
		if err != nil {
			localLog.Error().Err(err).Msg("failed to get containers status")
			continue
		}
		localLog.Trace().Str("container_status", containerStatus).Msg("got container status")
		switch containerStatus {
		case ContainerStatusExited, ContainerStatusDead, ContainerStatusRemoving:
			lw.collectContainerLog(opCtx, &op, localLog)
			err = lw.dockerManager.RemoveContainer(opCtx, xdocker.InstanceID(op.DockerCode))
			if err != nil {
				localLog.Error().Err(err).Msg("failed to remove container")
			}
		default:
			localLog.Trace().Msg("skipped")
		}
	}
}

func (lw *logWatcher) collectContainerLog(ctx context.Context, op *storage.Operation, log zerolog.Logger) {
	clusterInfo, err := lw.db.GetCluster(ctx, op.ClusterID)
	if err != nil {
		log.Error().Err(err).Msg("failed to get cluster from db")

		return
	}

	fileLog := lw.cfg.Docker.LogDir + "/" + clusterInfo.Name + ".json"
	fLog, err := os.Open(fileLog)
	if err != nil {
		reason := fmt.Sprintf("can't open log file %q", fileLog)
		lw.markClusterStatusFailed(ctx, op.ID, op.ClusterID, log, err, reason)

		return
	}

	var logs []LogEntity
	jsonDec := json.NewDecoder(fLog)
	err = jsonDec.Decode(&logs)
	if err != nil {
		lw.markClusterStatusFailed(ctx, op.ID, op.ClusterID, log, err, "failed to decode log file's JSON")

		return
	}

	var status string
	for _, logEntity := range logs {
		switch logEntity.Task {
		case LogFieldSystemInfo:
			var serverInfo SystemInfo
			err = mapstructure.Decode(logEntity.Msg, &serverInfo)
			if err != nil {
				log.Error().Err(err).Any("msg", logEntity.Msg).Msg("failed to decode system_info")
				continue
			}

			createdServer, err := lw.db.CreateServer(ctx, &storage.CreateServerReq{
				ClusterID:      clusterInfo.ID,
				ServerName:     serverInfo.ServerName,
				ServerLocation: serverInfo.ServerLocation,
				IpAddress:      serverInfo.IpAddress,
			})
			if err != nil {
				log.Error().Err(err).Msg("failed to store server to db")

				continue
			}
			log.Trace().Any("server", createdServer).Msg("server was created")
		case LogFieldConnectionInfo:
			_, err := lw.db.UpdateCluster(ctx, &storage.UpdateClusterReq{
				ID:             op.ClusterID,
				ConnectionInfo: logEntity.Msg,
			})
			if err != nil {
				log.Error().Err(err).Msg("failed to update cluster")

				continue
			}
		}
		if logEntity.Summary != nil {
			status = logEntity.Status
		}
	}
	if len(status) == 0 {
		log.Warn().Msg("summary not found in logs")

		status = storage.OperationStatusFailed
	}
	updatedOperation, err := lw.db.UpdateOperation(ctx, &storage.UpdateOperationReq{
		ID:     op.ID,
		Status: &status,
	})
	if err != nil {
		log.Error().Err(err).Msg("failed to update operation status in db")
	} else {
		log.Trace().Any("operation", updatedOperation).Msg("operation was updated in db")
	}

	// set cluster status
	if status == storage.OperationStatusFailed {
		status = storage.ClusterStatusFailed
	} else {
		status = storage.ClusterStatusReady
	}
	updatedCluster, err := lw.db.UpdateCluster(ctx, &storage.UpdateClusterReq{
		ID:     op.ClusterID,
		Status: &status,
	})
	if err != nil {
		log.Error().Err(err).Msg("failed to update cluster status in db")
	} else {
		log.Trace().Any("cluster", updatedCluster).Msg("cluster was updated in db")
	}
}

func (lw *logWatcher) markClusterStatusFailed(ctx context.Context, opID, clusterID int64, log zerolog.Logger, err error, reason string) {
	log.Error().Err(err).Msg(reason)

	status := storage.OperationStatusFailed
	if _, err = lw.db.UpdateOperation(ctx, &storage.UpdateOperationReq{
		ID:     opID,
		Status: &status,
	}); err != nil {
		log.Error().Err(err).Msg("failed to update operation status in db")
	}

	status = storage.ClusterStatusFailed
	if _, err = lw.db.UpdateCluster(ctx, &storage.UpdateClusterReq{
		ID:     clusterID,
		Status: &status,
	}); err != nil {
		log.Error().Err(err).Msg("failed to update cluster status in db")
	}
}
