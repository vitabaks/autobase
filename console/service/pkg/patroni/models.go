package patroni

type MonitoringInfo struct {
	State         string `json:"state"`
	Role          string `json:"role"`
	ServerVersion int    `json:"server_version"`
}

type ClusterInfo struct {
	Members []struct {
		Name           string      `json:"name"`
		Role           string      `json:"role"`
		State          string      `json:"state"`
		Host           string      `json:"host"`
		Timeline       int64       `json:"timeline"`
		Lag            interface{} `json:"lag"` // Replication lag in bytes, or "unknown".
		Tags           interface{} `json:"tags"`
		PendingRestart bool        `json:"pending_restart"`
	} `json:"members"`
}
