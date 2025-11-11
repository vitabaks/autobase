package xdocker

import (
	"bufio"
	"context"
	"net/http"
	"postgresql-cluster-console/pkg/tracer"
	"strings"
	"time"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"
	"github.com/goombaio/namegenerator"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

type dockerManager struct {
	cli   *client.Client
	log   zerolog.Logger
	image string
}

func NewDockerManager(host string, image string) (IManager, error) {
	var rt http.RoundTripper
	rt, err := NewRoundTripperLog(host, log.Logger.With().Str("module", "docker_client").Logger())
	if err != nil {
		return nil, err
	}
	cli, err := client.NewClientWithOpts(
		client.WithHost(host),
		client.WithHTTPClient(&http.Client{
			Transport: rt,
		}),
		client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, err
	}

	return &dockerManager{
		cli:   cli,
		log:   log.Logger.With().Str("module", "docker_manager").Logger(),
		image: strings.TrimSpace(image), // trim to avoid newline / spaces
	}, nil
}

func (m *dockerManager) ManageCluster(ctx context.Context, config *ManageClusterConfig) (InstanceID, error) {
	localLog := m.log.With().Str("cid", ctx.Value(tracer.CtxCidKey{}).(string)).Logger()
	err := m.pullImage(ctx, m.image)
	if err != nil {
		return "", err
	}

	resp, err := m.cli.ContainerCreate(ctx,
		&container.Config{
			Image: m.image,
			Tty:   true,
			Env:   config.Envs,
			Cmd: func() []string {
				cmd := []string{entryPoint, playbookCreateCluster}

				if config.ExtraVars != "" {
					cmd = append(cmd, "--extra-vars", config.ExtraVars)
				}

				return cmd
			}(),
			Entrypoint: nil,
		}, &container.HostConfig{
			NetworkMode: "host",
			Mounts: func() []mount.Mount {
				var mounts []mount.Mount
				for _, mountPath := range config.Mounts {
					mounts = append(mounts, mount.Mount{
						Type:   "bind",
						Source: mountPath.HostPath,
						Target: mountPath.DockerPath,
					})
				}

				return mounts
			}(),
		}, nil, nil, namegenerator.NewNameGenerator(time.Now().UTC().UnixNano()).Generate())

	if err != nil {
		return "", err
	}

	localLog.Trace().Str("id", resp.ID).Msg("container was created")
	if len(resp.Warnings) != 0 {
		localLog.Warn().Strs("warnings", resp.Warnings).Msg("warnings during container creation")
	}

	err = m.cli.ContainerStart(ctx, resp.ID, container.StartOptions{})
	if err != nil {
		errRem := m.cli.ContainerRemove(ctx, resp.ID, container.RemoveOptions{})
		if errRem != nil {
			localLog.Error().Err(errRem).Msg("failed to remove container after error on start")
		}

		return "", err
	}

	return InstanceID(resp.ID), nil
}

func (m *dockerManager) PreloadImage(ctx context.Context) {
	_ = m.pullImage(ctx, m.image)
}

func (m *dockerManager) GetStatus(ctx context.Context, id InstanceID) (string, error) {
	inspectRes, err := m.cli.ContainerInspect(ctx, string(id))
	if err != nil {
		return "", err
	}

	return inspectRes.State.Status, nil
}

func (m *dockerManager) StoreContainerLogs(ctx context.Context, ID InstanceID, store func(logMessage string)) {
	localLog := m.log.With().Str("cid", ctx.Value(tracer.CtxCidKey{}).(string)).Logger()
	localLog.Trace().Msg("StoreContainerLogs called")
	hijackedCon, err := m.cli.ContainerAttach(ctx, string(ID), container.AttachOptions{
		Stream:     true,
		Stdin:      false,
		Stdout:     true,
		Stderr:     true,
		DetachKeys: "",
		Logs:       true,
	})
	if err != nil {
		localLog.Error().Err(err).Msg("failed to get container logs")

		return
	}
	localLog.Trace().Msg("got container logs")
	defer func() {
		hijackedCon.Close()
	}()

	scanner := bufio.NewScanner(hijackedCon.Reader)
	localLog.Trace().Msg("starting to scan logs")
	for {
		if ctx.Err() != nil {
			localLog.Error().Err(ctx.Err()).Msg("ctx error")
			break
		}
		if !scanner.Scan() {
			localLog.Trace().Err(scanner.Err()).Msg("scanner scan returned false")
			break
		}
		s := scanner.Text()

		store(s)
	}
}

func (m *dockerManager) RemoveContainer(ctx context.Context, id InstanceID) error {
	return m.cli.ContainerRemove(ctx, string(id), container.RemoveOptions{})
}
