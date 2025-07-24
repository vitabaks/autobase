package storage

const (
	DefaultLimit       = 20
	InstanceTypeSmall  = "Small Size"
	InstanceTypeMedium = "Medium Size"
	InstanceTypeLarge  = "Large Size"

	OperationStatusInProgress = "in_progress"
	OperationStatusSuccess    = "success"
	OperationStatusFailed     = "failed"

	OperationTypeDeploy = "deploy"

	ClusterStatusFailed      = "failed"
	ClusterStatusHealthy     = "healthy"
	ClusterStatusUnhealthy   = "unhealthy"
	ClusterStatusDegraded    = "degraded"
	ClusterStatusReady       = "ready"
	ClusterStatusUnavailable = "unavailable"
)

var (
	secretSortFields = map[string]string{
		"name":       "secret_name",
		"id":         "secret_id",
		"type":       "secret_type",
		"created_at": "created_at",
		"updated_at": "updated_at",
	}

	clusterSortFields = map[string]string{
		"name":             "cluster_name",
		"id":               "cluster_id",
		"created_at":       "created_at",
		"updated_at":       "updated_at",
		"environment":      "environment_id",
		"status":           "cluster_status",
		"project":          "project_id",
		"location":         "cluster_location",
		"server_count":     "server_count",
		"postgres_version": "postgres_version",
	}

	operationSortFields = map[string]string{
		"cluster_name": "cluster",
		"type":         "type",
		"status":       "status",
		"id":           "id",
		"started":      "started",
		"finished":     "finished",
		"cluster":      "cluster",
		"environment":  "environment",
	}
)
