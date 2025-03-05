package storage

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type dbStorage struct {
	db *pgxpool.Pool
}

func NewDbStorage(db *pgxpool.Pool) IStorage {
	return &dbStorage{
		db: db,
	}
}

func (s *dbStorage) GetCloudProviders(ctx context.Context, limit, offset *int64) ([]CloudProvider, *MetaPagination, error) {
	var (
		curOffset = int64(0)
		curLimit  = int64(DefaultLimit)
	)
	if limit != nil {
		curLimit = *limit
	}
	if offset != nil {
		curOffset = *offset
	}

	count, err := QueryRowToScalar[int64](ctx, s.db, "select count(*) from cloud_providers")
	if err != nil {
		return nil, nil, err
	}

	cloudProviders, err := QueryRowsToStruct[CloudProvider](ctx, s.db, "select * from cloud_providers order by provider_name limit $1 offset $2", curLimit, curOffset)
	if err != nil {
		return nil, nil, err
	}

	return cloudProviders, &MetaPagination{
		Limit:  curLimit,
		Offset: curOffset,
		Count:  count,
	}, nil
}

func (s *dbStorage) GetCloudProviderInfo(ctx context.Context, providerCode string) (*CloudProviderInfo, error) {
	cloudInstances, err := QueryRowsToStruct[CloudInstance](ctx, s.db, "select * from cloud_instances where cloud_provider = $1 order by cpu, ram", providerCode)
	if err != nil {
		return nil, err
	}

	cloudRegions, err := QueryRowsToStruct[CloudRegion](ctx, s.db, "select * from cloud_regions where cloud_provider = $1 order by region_name", providerCode)
	if err != nil {
		return nil, err
	}

	cloudVolumes, err := QueryRowsToStruct[CloudVolume](ctx, s.db, "select * from cloud_volumes where cloud_provider = $1", providerCode)
	if err != nil {
		return nil, err
	}

	cloudImages, err := QueryRowsToStruct[CloudImage](ctx, s.db, "select * from cloud_images where cloud_provider = $1", providerCode)
	if err != nil {
		return nil, err
	}

	return &CloudProviderInfo{
		Code:           providerCode,
		CloudRegions:   cloudRegions,
		CloudInstances: cloudInstances,
		CloudVolumes:   cloudVolumes,
		CloudImages:    cloudImages,
	}, nil
}

func (s *dbStorage) GetPostgresVersions(ctx context.Context) ([]PostgresVersion, error) {
	postgresVersions, err := QueryRowsToStruct[PostgresVersion](ctx, s.db, "select * from postgres_versions order by major_version")
	if err != nil {
		return nil, err
	}

	return postgresVersions, nil
}

func (s *dbStorage) CreateSetting(ctx context.Context, name string, value interface{}) (*Setting, error) {
	setting, err := QueryRowToStruct[Setting](ctx, s.db,
		`insert into settings(setting_name, setting_value) values($1, $2) returning *`,
		name, value)
	if err != nil {
		return nil, err
	}

	return setting, nil
}

func (s *dbStorage) GetSettings(ctx context.Context, req *GetSettingsReq) ([]Setting, *MetaPagination, error) {
	var (
		curOffset = int64(0)
		curLimit  = int64(DefaultLimit)
	)
	if req.Limit != nil {
		curLimit = *req.Limit
	}
	if req.Offset != nil {
		curOffset = *req.Offset
	}

	var (
		extraWhere           string
		extraArgsCurPosition = 1
	)
	extraArgs := []interface{}{}
	{
		if req.Name != nil {
			extraWhere = " where setting_name = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.Name)
			extraArgsCurPosition++
		}
	}

	count, err := QueryRowToScalar[int64](ctx, s.db, "select count(*) from settings"+extraWhere, extraArgs...)
	if err != nil {
		return nil, nil, err
	}

	limit := " limit $" + strconv.Itoa(extraArgsCurPosition) + " offset $" + strconv.Itoa(extraArgsCurPosition+1)
	extraArgs = append(extraArgs, curLimit, curOffset)

	settings, err := QueryRowsToStruct[Setting](ctx, s.db, "select * from settings "+extraWhere+" order by id"+limit, extraArgs...)
	if err != nil {
		return nil, nil, err
	}

	return settings, &MetaPagination{
		Limit:  curLimit,
		Offset: curOffset,
		Count:  count,
	}, nil
}

func (s *dbStorage) GetSettingByName(ctx context.Context, name string) (*Setting, error) {
	setting, err := QueryRowToStruct[Setting](ctx, s.db, "select * from settings where setting_name = $1", name)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return setting, nil
}

func (s *dbStorage) UpdateSetting(ctx context.Context, name string, value interface{}) (*Setting, error) {
	setting, err := QueryRowToStruct[Setting](ctx, s.db,
		`update settings set 
                    setting_value = $1
                    where setting_name = $2
                    returning *`,
		value, name)
	if err != nil {
		return nil, err
	}

	return setting, nil
}

func (s *dbStorage) CreateProject(ctx context.Context, name, description string) (*Project, error) {
	project, err := QueryRowToStruct[Project](ctx, s.db,
		`insert into projects(project_name, project_description) values($1, $2) returning *`,
		name, description)
	if err != nil {
		return nil, err
	}

	return project, nil
}

func (s *dbStorage) GetProjects(ctx context.Context, limit, offset *int64) ([]Project, *MetaPagination, error) {
	var (
		curOffset = int64(0)
		curLimit  = int64(DefaultLimit)
	)
	if limit != nil {
		curLimit = *limit
	}
	if offset != nil {
		curOffset = *offset
	}

	count, err := QueryRowToScalar[int64](ctx, s.db, "select count(*) from projects")
	if err != nil {
		return nil, nil, err
	}

	projects, err := QueryRowsToStruct[Project](ctx, s.db, "select * from projects order by project_id limit $1 offset $2", curLimit, curOffset)
	if err != nil {
		return nil, nil, err
	}

	return projects, &MetaPagination{
		Limit:  curLimit,
		Offset: curOffset,
		Count:  count,
	}, nil
}

func (s *dbStorage) GetProject(ctx context.Context, id int64) (*Project, error) {
	project, err := QueryRowToStruct[Project](ctx, s.db, "select * from projects where project_id = $1", id)
	if err != nil {
		return nil, err
	}

	return project, nil
}

func (s *dbStorage) GetProjectByName(ctx context.Context, name string) (*Project, error) {
	project, err := QueryRowToStruct[Project](ctx, s.db, "select * from projects where project_name = $1", name)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return project, nil
}

func (s *dbStorage) DeleteProject(ctx context.Context, id int64) error {
	_, err := s.db.Exec(ctx, "delete from projects where project_id=$1", id)

	return err
}

func (s *dbStorage) UpdateProject(ctx context.Context, id int64, name, description *string) (*Project, error) {
	project, err := QueryRowToStruct[Project](ctx, s.db,
		`update projects set 
                    project_name = coalesce($1, project_name),
                    project_description = coalesce($2, project_description)
                    where project_id = $3
                    returning *`,
		name, description, id)
	if err != nil {
		return nil, err
	}

	return project, nil
}

func (s *dbStorage) GetEnvironments(ctx context.Context, limit, offset *int64) ([]Environment, *MetaPagination, error) {
	var (
		curOffset = int64(0)
		curLimit  = int64(DefaultLimit)
	)
	if limit != nil {
		curLimit = *limit
	}
	if offset != nil {
		curOffset = *offset
	}

	count, err := QueryRowToScalar[int64](ctx, s.db, "select count(*) from environments")
	if err != nil {
		return nil, nil, err
	}

	environments, err := QueryRowsToStruct[Environment](ctx, s.db, "select * from environments order by environment_id limit $1 offset $2", curLimit, curOffset)
	if err != nil {
		return nil, nil, err
	}

	return environments, &MetaPagination{
		Limit:  curLimit,
		Offset: curOffset,
		Count:  count,
	}, nil
}

func (s *dbStorage) GetEnvironment(ctx context.Context, id int64) (*Environment, error) {
	environment, err := QueryRowToStruct[Environment](ctx, s.db, "select * from environments where environment_id = $1", id)
	if err != nil {
		return nil, err
	}

	return environment, nil
}

func (s *dbStorage) GetEnvironmentByName(ctx context.Context, name string) (*Environment, error) {
	environment, err := QueryRowToStruct[Environment](ctx, s.db, "select * from environments where environment_name = $1", name)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return environment, nil
}

func (s *dbStorage) CreateEnvironment(ctx context.Context, req *AddEnvironmentReq) (*Environment, error) {
	environment, err := QueryRowToStruct[Environment](ctx, s.db, "insert into environments(environment_name, environment_description) values($1, $2) returning *",
		req.Name, req.Description)
	if err != nil {
		return nil, err
	}

	return environment, nil
}

func (s *dbStorage) DeleteEnvironment(ctx context.Context, id int64) error {
	_, err := s.db.Exec(ctx, "delete from environments where environment_id=$1", id)

	return err
}

func (s *dbStorage) CheckEnvironmentIsUsed(ctx context.Context, id int64) (bool, error) {
	count, err := QueryRowToScalar[int64](ctx, s.db, "select count(*) from clusters where environment_id = $1", id)
	if err != nil {
		return false, err
	}

	return count != 0, nil
}

func (s *dbStorage) GetSecrets(ctx context.Context, req *GetSecretsReq) ([]SecretView, *MetaPagination, error) {
	var (
		curOffset = int64(0)
		curLimit  = int64(DefaultLimit)
	)
	if req.Limit != nil {
		curLimit = *req.Limit
	}
	if req.Offset != nil {
		curOffset = *req.Offset
	}

	var (
		extraWhere           string
		extraArgsCurPosition = 2
	)
	extraArgs := []interface{}{req.ProjectID}
	{
		if req.Name != nil {
			extraWhere = " and secret_name = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.Name)
			extraArgsCurPosition++
		}
		if req.Type != nil {
			extraWhere += " and secret_type = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgsCurPosition++
			extraArgs = append(extraArgs, req.Type)
		}
	}

	count, err := QueryRowToScalar[int64](ctx, s.db, "select count(*) from secrets where project_id = $1"+extraWhere, extraArgs...)
	if err != nil {
		return nil, nil, err
	}

	orderBy := OrderByConverter(req.SortBy, "secret_id", secretSortFields)

	limit := " limit $" + strconv.Itoa(extraArgsCurPosition) + " offset $" + strconv.Itoa(extraArgsCurPosition+1)
	extraArgs = append(extraArgs, curLimit, curOffset)

	secrets, err := QueryRowsToStruct[SecretView](ctx, s.db, "select * from v_secrets_list where project_id = $1 "+extraWhere+" order by "+orderBy+limit, extraArgs...)
	if err != nil {
		return nil, nil, err
	}

	return secrets, &MetaPagination{
		Limit:  curLimit,
		Offset: curOffset,
		Count:  count,
	}, nil
}

func (s *dbStorage) GetSecret(ctx context.Context, id int64) (*SecretView, error) {
	sec, err := QueryRowToStruct[SecretView](ctx, s.db, "select * from v_secrets_list where secret_id = $1", id)
	if err != nil {
		return nil, err
	}

	return sec, nil
}

func (s *dbStorage) GetSecretByName(ctx context.Context, name string) (*SecretView, error) {
	sec, err := QueryRowToStruct[SecretView](ctx, s.db, "select * from v_secrets_list where secret_name = $1", name)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return sec, nil
}

func (s *dbStorage) CreateSecret(ctx context.Context, req *AddSecretReq) (*SecretView, error) {
	secretID, err := QueryRowToScalar[int64](ctx, s.db, "select * from add_secret($1, $2, $3, $4, $5)",
		req.ProjectID, req.Type, req.Name, req.Value, req.SecretKey)
	if err != nil {
		return nil, err
	}

	secret, err := QueryRowToStruct[SecretView](ctx, s.db, "select * from v_secrets_list where secret_id = $1 ", secretID)
	if err != nil {
		return nil, err
	}

	return secret, err
}

func (s *dbStorage) UpdateSecret(ctx context.Context, req *EditSecretReq) (*SecretView, error) {
	return nil, nil
}

func (s *dbStorage) DeleteSecret(ctx context.Context, id int64) error {
	_, err := s.db.Exec(ctx, "delete from secrets where secret_id=$1", id)

	return err
}

func (s *dbStorage) GetSecretVal(ctx context.Context, id int64, secretKey string) ([]byte, error) {
	secretVal, err := QueryRowToScalar[[]byte](ctx, s.db, "select * from get_secret($1, $2)",
		id, secretKey)
	if err != nil {
		return nil, err
	}

	return secretVal, nil
}

func (s *dbStorage) GetExtensions(ctx context.Context, req *GetExtensionsReq) ([]Extension, *MetaPagination, error) {
	var (
		curOffset = int64(0)
		curLimit  = int64(DefaultLimit)
	)
	if req.Limit != nil {
		curLimit = *req.Limit
	}
	if req.Offset != nil {
		curOffset = *req.Offset
	}

	subQuery := ` WHERE (e.postgres_min_version IS NULL OR e.postgres_min_version::float <= $1)
          			AND (e.postgres_max_version IS NULL OR e.postgres_max_version::float >= $1)
          			AND ($2 = 'all' OR ($2 = 'contrib' AND e.contrib = true) OR ($2 = 'third_party' AND e.contrib = false))`

	count, err := QueryRowToScalar[int64](ctx, s.db, "select count(*) from extensions as e "+subQuery, req.PostgresVersion, req.Type)
	if err != nil {
		return nil, nil, err
	}

	extensions, err := QueryRowsToStruct[Extension](ctx, s.db, "select * from extensions as e"+subQuery+
		"ORDER BY e.contrib, e.extension_image IS NULL, e.extension_name limit $3 offset $4",
		req.PostgresVersion, req.Type, curLimit, curOffset)
	if err != nil {
		return nil, nil, err
	}

	return extensions, &MetaPagination{
		Limit:  curLimit,
		Offset: curOffset,
		Count:  count,
	}, nil
}

func (s *dbStorage) CreateCluster(ctx context.Context, req *CreateClusterReq) (*Cluster, error) {
	cluster, err := QueryRowToStruct[Cluster](ctx, s.db, `insert into clusters(project_id, environment_id, cluster_name, cluster_description, secret_id, extra_vars, cluster_status, cluster_location, server_count, postgres_version, inventory)
			values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`, req.ProjectID, req.EnvironmentID, req.Name, req.Description, req.SecretID, req.ExtraVars, req.Status, req.Location, req.ServerCount, req.PostgreSqlVersion, req.Inventory)
	if err != nil {
		return nil, err
	}

	return cluster, nil
}

func (s *dbStorage) UpdateCluster(ctx context.Context, req *UpdateClusterReq) (*Cluster, error) {
	cluster, err := QueryRowToStruct[Cluster](ctx, s.db,
		`update clusters
		set connection_info = coalesce($1, connection_info),
		    cluster_status = coalesce($2, cluster_status),
		    flags = coalesce($3, flags)
		where cluster_id = $4 returning *`,
		req.ConnectionInfo, req.Status, req.Flags, req.ID)
	if err != nil {
		return nil, err
	}

	return cluster, nil
}

func (s *dbStorage) GetDefaultClusterName(ctx context.Context) (string, error) {
	name, err := QueryRowToScalar[string](ctx, s.db, "select * from get_cluster_name()")
	if err != nil {
		return "", err
	}

	return name, nil
}

func (s *dbStorage) CreateOperation(ctx context.Context, req *CreateOperationReq) (*Operation, error) {
	operation, err := QueryRowToStruct[Operation](ctx, s.db, `insert into operations(project_id, cluster_id, docker_code, operation_type, operation_status, cid)
			values($1, $2, $3, $4, $5, $6) returning *`, req.ProjectID, req.ClusterID, req.DockerCode, req.Type, OperationStatusInProgress, req.Cid)
	if err != nil {
		return nil, err
	}

	return operation, nil
}

func (s *dbStorage) GetClusterByName(ctx context.Context, name string) (*Cluster, error) {
	cluster, err := QueryRowToStruct[Cluster](ctx, s.db, "select * from clusters where cluster_name = $1", name)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return cluster, nil
}

func (s *dbStorage) GetCluster(ctx context.Context, id int64) (*Cluster, error) {
	cluster, err := QueryRowToStruct[Cluster](ctx, s.db, "select * from clusters where cluster_id = $1", id)
	if err != nil {
		return nil, err
	}

	return cluster, nil
}

func (s *dbStorage) GetClusters(ctx context.Context, req *GetClustersReq) ([]Cluster, *MetaPagination, error) {
	var (
		curOffset = int64(0)
		curLimit  = int64(DefaultLimit)
	)
	if req.Limit != nil {
		curLimit = *req.Limit
	}
	if req.Offset != nil {
		curOffset = *req.Offset
	}

	var (
		extraWhere           string
		extraArgsCurPosition = 2
	)
	extraArgs := []interface{}{req.ProjectID}
	{
		if req.Name != nil {
			extraWhere += " and cluster_name = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.Name)
			extraArgsCurPosition++
		}
		if req.Status != nil {
			extraWhere += " and cluster_status = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.Status)
			extraArgsCurPosition++
		}
		if req.Location != nil {
			extraWhere += " and cluster_location = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.Location)
			extraArgsCurPosition++
		}
		if req.EnvironmentID != nil {
			extraWhere += " and environment_id = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.EnvironmentID)
			extraArgsCurPosition++
		}
		if req.ServerCount != nil {
			extraWhere += " and server_count = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.ServerCount)
			extraArgsCurPosition++
		}
		if req.PostgresVersion != nil {
			extraWhere += " and postgres_version = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.PostgresVersion)
			extraArgsCurPosition++
		}
		if req.CreatedAtFrom != nil {
			extraWhere += " and created_at >= $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.CreatedAtFrom)
			extraArgsCurPosition++
		}
		if req.CreatedAtTo != nil {
			extraWhere += " and created_at <= $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.CreatedAtTo)
			extraArgsCurPosition++
		}
	}

	count, err := QueryRowToScalar[int64](ctx, s.db, "select count(*) from clusters where  project_id = $1 and deleted_at is null"+extraWhere, extraArgs...)
	if err != nil {
		return nil, nil, err
	}

	orderBy := OrderByConverter(req.SortBy, "cluster_id", clusterSortFields)

	limit := " limit $" + strconv.Itoa(extraArgsCurPosition) + " offset $" + strconv.Itoa(extraArgsCurPosition+1)
	extraArgs = append(extraArgs, curLimit, curOffset)

	clusters, err := QueryRowsToStruct[Cluster](ctx, s.db, "select * from clusters where project_id = $1 and deleted_at is null"+extraWhere+" order by "+orderBy+limit,
		extraArgs...)
	if err != nil {
		return nil, nil, err
	}

	return clusters, &MetaPagination{
		Limit:  curLimit,
		Offset: curOffset,
		Count:  count,
	}, nil
}

func (s *dbStorage) DeleteCluster(ctx context.Context, id int64) error {
	_, err := s.db.Exec(ctx, "delete from operations where cluster_id = $1", id)
	if err != nil {
		return err
	}

	_, err = s.db.Exec(ctx, "delete from servers where cluster_id = $1", id)
	if err != nil {
		return err
	}

	_, err = s.db.Exec(ctx, "delete from clusters where cluster_id = $1", id)
	if err != nil {
		return err
	}

	return nil
}

func (s *dbStorage) DeleteClusterSoft(ctx context.Context, id int64) error {
	query := `
	  update clusters
	  set
		deleted_at = current_timestamp,
		secret_id = null,
		cluster_name = cluster_name || '_deleted_' || to_char(current_timestamp, 'yyyymmddhh24miss')
	  where
		cluster_id = $1
	`
	_, err := s.db.Exec(ctx, query, id)

	return err
}

func (s *dbStorage) DeleteServer(ctx context.Context, id int64) error {
	_, err := s.db.Exec(ctx, "delete from servers where server_id = $1", id)
	if err != nil {
		return err
	}

	return nil
}

func (s *dbStorage) GetInProgressOperations(ctx context.Context, from time.Time) ([]Operation, error) {
	operations, err := QueryRowsToStruct[Operation](ctx, s.db, "select * from operations where operation_status = $1 and created_at > $2",
		OperationStatusInProgress, from)
	if err != nil {
		return nil, err
	}

	return operations, nil
}

func (s *dbStorage) UpdateOperation(ctx context.Context, req *UpdateOperationReq) (*Operation, error) {
	operation, err := QueryRowToStruct[Operation](ctx, s.db,
		`update operations
		set operation_status = coalesce($1, operation_status),
		    operation_log = case when $2::text is null then operation_log else concat(operation_log, CHR(10), $2::text) end
		where id = $3 returning id, project_id, cluster_id, docker_code, cid, operation_type, operation_status, null, created_at, updated_at`,
		req.Status, req.Logs, req.ID)
	if err != nil {
		return nil, err
	}

	return operation, nil
}

func (s *dbStorage) GetOperations(ctx context.Context, req *GetOperationsReq) ([]OperationView, *MetaPagination, error) {
	var (
		curOffset = int64(0)
		curLimit  = int64(DefaultLimit)
	)
	if req.Limit != nil {
		curLimit = *req.Limit
	}
	if req.Offset != nil {
		curOffset = *req.Offset
	}

	subQuery := `WHERE project_id = $1 and started >= $2 and started <= $3`

	var (
		extraWhere           string
		extraArgsCurPosition = 4
	)
	extraArgs := []interface{}{req.ProjectID, req.StartedFrom, req.EndedTill}
	{
		if req.ClusterName != nil {
			extraWhere = " and cluster = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgs = append(extraArgs, req.ClusterName)
			extraArgsCurPosition++
		}
		if req.Type != nil {
			extraWhere += " and type = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgsCurPosition++
			extraArgs = append(extraArgs, req.Type)
		}
		if req.Status != nil {
			extraWhere += " and status = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgsCurPosition++
			extraArgs = append(extraArgs, req.Status)
		}
		if req.Environment != nil {
			extraWhere += " and environment = $" + strconv.Itoa(extraArgsCurPosition)
			extraArgsCurPosition++
			extraArgs = append(extraArgs, req.Environment)
		}
	}

	count, err := QueryRowToScalar[int64](ctx, s.db, "select count(*) from v_operations "+subQuery+extraWhere, extraArgs...)
	if err != nil {
		return nil, nil, err
	}

	orderBy := OrderByConverter(req.SortBy, "id DESC", operationSortFields)

	limit := " limit $" + strconv.Itoa(extraArgsCurPosition) + " offset $" + strconv.Itoa(extraArgsCurPosition+1)
	extraArgs = append(extraArgs, curLimit, curOffset)

	operations, err := QueryRowsToStruct[OperationView](ctx, s.db, "select * from v_operations "+subQuery+extraWhere+
		" order by "+orderBy+limit,
		extraArgs...)
	if err != nil {
		return nil, nil, err
	}

	return operations, &MetaPagination{
		Limit:  curLimit,
		Offset: curOffset,
		Count:  count,
	}, nil
}

func (s *dbStorage) GetOperation(ctx context.Context, id int64) (*Operation, error) {
	operation, err := QueryRowToStruct[Operation](ctx, s.db, "select * from operations where id = $1", id)
	if err != nil {
		return nil, err
	}

	return operation, nil
}

func (s *dbStorage) CreateServer(ctx context.Context, req *CreateServerReq) (*Server, error) {
	server, err := QueryRowToStruct[Server](ctx, s.db, `insert into servers(cluster_id, server_name, server_location, ip_address)	
			values($1, $2, $3, $4) returning *`, req.ClusterID, req.ServerName, req.ServerLocation, req.IpAddress)
	if err != nil {
		return nil, err
	}

	return server, nil
}

func (s *dbStorage) GetServer(ctx context.Context, id int64) (*Server, error) {
	server, err := QueryRowToStruct[Server](ctx, s.db, "select * from servers where server_id = $1", id)
	if err != nil {
		return nil, err
	}

	return server, nil
}

func (s *dbStorage) GetClusterServers(ctx context.Context, clusterID int64) ([]Server, error) {
	servers, err := QueryRowsToStruct[Server](ctx, s.db, "select * from servers where cluster_id = $1", clusterID)
	if err != nil {
		return nil, err
	}

	return servers, nil
}

func (s *dbStorage) UpdateServer(ctx context.Context, req *UpdateServerReq) (*Server, error) {
	server, err := QueryRowToStruct[Server](ctx, s.db,
		`insert into servers(cluster_id, ip_address, server_name, server_role, server_status, timeline, lag, tags, pending_restart)	
					values($1, $2, $3, $4, $5, $6, $7, $8, $9) on conflict(cluster_id, ip_address) do update
					    set server_name = case when EXCLUDED.server_name = '' then servers.server_name else EXCLUDED.server_name end,
        					server_role = coalesce(EXCLUDED.server_role, servers.server_role),
        					server_status = coalesce(EXCLUDED.server_status, servers.server_status),
        					timeline = coalesce(EXCLUDED.timeline, servers.timeline),
        					lag = EXCLUDED.lag,
        					tags = coalesce(EXCLUDED.tags, servers.tags),
        					pending_restart = coalesce(EXCLUDED.pending_restart, servers.pending_restart) returning *`,
		req.ClusterID, req.IpAddress, req.Name, req.Role, req.Status, req.Timeline, req.Lag, req.Tags, req.PendingRestart)
	if err != nil {
		return nil, err
	}

	return server, nil
}

func (s *dbStorage) ResetServer(ctx context.Context, clusterID int64, ipAddress string) (*Server, error) {
	server, err := QueryRowToStruct[Server](ctx, s.db,
		`update servers set
					server_role = 'N/A',
					server_status = 'N/A',
					timeline = null,
					lag = null,
					tags = null where cluster_id = $1 and ip_address = $2 returning *`,
		clusterID, ipAddress)

	if err != nil {
		return nil, err
	}

	return server, nil
}
