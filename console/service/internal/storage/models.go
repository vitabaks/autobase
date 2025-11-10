package storage

import (
	"net"
	"time"
)

type CloudProvider struct {
	Code          string
	Description   string
	ProviderImage string
}

type CloudRegion struct {
	ProviderCode string
	RegionGroup  string
	RegionName   string
	Description  string
}

type CloudInstance struct {
	ProviderCode  string
	InstanceGroup string
	InstanceName  string
	Arch          string
	Cpu           int64
	Ram           int64
	PriceHourly   float64
	PriceMonthly  float64
	Currency      string
	UpdatedAt     time.Time
	SharedCpu     bool
}

type CloudImage struct {
	ProviderCode string
	Region       string
	Image        interface{}
	Arch         string
	OsName       string
	OsVersion    string
	UpdatedAt    time.Time
}

type CloudVolume struct {
	ProviderCode      string
	VolumeType        string
	VolumeDescription string
	VolumeMinSize     int64
	VolumeMaxSize     int64
	PriceMonthly      float64
	Currency          string
	IsDefault         bool
	UpdatedAt         time.Time
}

type CloudProviderInfo struct {
	Code           string
	CloudRegions   []CloudRegion
	CloudInstances []CloudInstance
	CloudVolumes   []CloudVolume
	CloudImages    []CloudImage
}

type PostgresVersion struct {
	MajorVersion int64
	ReleaseDate  time.Time
	EndOfLife    time.Time
}

type Setting struct {
	ID        int64
	Name      string
	Value     interface{}
	CreatedAt time.Time
	UpdatedAt *time.Time
}

type GetSettingsReq struct {
	Name *string

	Limit  *int64
	Offset *int64
}

type MetaPagination struct {
	Limit  int64
	Offset int64
	Count  int64
}

type Project struct {
	ID          int64
	Name        string
	Description *string
	CreatedAt   time.Time
	UpdatedAt   *time.Time
}

type Environment struct {
	ID          int64
	Name        string
	Description *string
	CreatedAt   time.Time
	UpdatedAt   *time.Time
}

type AddEnvironmentReq struct {
	Name        string
	Description string
}

type SecretView struct {
	ProjectID      int64
	ID             int64
	Name           string
	Type           string
	CreatedAt      time.Time
	UpdatedAt      *time.Time
	IsUsed         bool
	UsedByClusters *string
}

type GetSecretsReq struct {
	ProjectID int64
	Name      *string
	Type      *string
	SortBy    *string

	Limit  *int64
	Offset *int64
}

type AddSecretReq struct {
	ProjectID int64
	Type      string
	Name      string
	Value     []byte
	SecretKey string
}

type EditSecretReq struct {
	ProjectID int64
	Type      *string
	Name      *string
	Value     []byte
	SecretKey string
}

type Extension struct {
	Name               string
	Description        *string
	Url                *string
	Image              *string
	PostgresMinVersion *string
	PostgresMaxVersion *string
	Contrib            bool
}

type GetExtensionsReq struct {
	Type            *string
	PostgresVersion *string

	Limit  *int64
	Offset *int64
}

type Cluster struct {
	ID             int64
	ProjectID      int64
	EnvironmentID  int64
	SecretID       *int64
	Name           string
	Status         string
	Description    string
	Location       *string
	ConnectionInfo interface{}
	ExtraVars      []byte
	Inventory      []byte
	ServersCount   int32
	PostgreVersion int32
	CreatedAt      time.Time
	UpdatedAt      *time.Time
	DeletedAt      *time.Time
	Flags          uint32
}

type GetClustersReq struct {
	ProjectID       int64
	Name            *string
	SortBy          *string
	Status          *string
	Location        *string
	ServerCount     *int64
	PostgresVersion *int64
	EnvironmentID   *int64
	CreatedAtFrom   *time.Time
	CreatedAtTo     *time.Time

	Limit  *int64
	Offset *int64
}

type CreateClusterReq struct {
	ProjectID         int64
	EnvironmentID     int64
	Name              string
	Description       string
	SecretID          *int64
	ExtraVars         string // JSON string
	Location          string
	ServerCount       int
	PostgreSqlVersion int
	Status            string
	Inventory         []byte
}

type UpdateClusterReq struct {
	ID             int64
	ConnectionInfo interface{}
	Status         *string
	Flags          *uint32
}

type Operation struct {
	ID         int64
	ProjectID  int64
	ClusterID  int64
	DockerCode string
	Cid        string
	Type       string
	Status     string
	Log        *string
	CreatedAt  time.Time
	UpdatedAt  *time.Time
}

type OperationView struct {
	ProjectID   int64
	ClusterID   int64
	ID          int64
	Started     time.Time
	Finished    *time.Time
	Type        string
	Status      string
	Cluster     string
	Environment string
}

type CreateOperationReq struct {
	ProjectID  int64
	ClusterID  int64
	DockerCode string
	Type       string
	Cid        string
}

type UpdateOperationReq struct {
	ID     int64
	Status *string
	Logs   *string
}

type GetOperationsReq struct {
	ProjectID   int64
	StartedFrom time.Time
	EndedTill   time.Time
	ClusterName *string
	Type        *string
	Status      *string
	Environment *string
	SortBy      *string

	Limit  *int64
	Offset *int64
}

type Server struct {
	ID             int64
	ClusterID      int64
	Name           string
	Location       *string
	Role           string
	Status         string
	IpAddress      net.IP
	Timeline       *int64
	Lag            *int64
	Tags           interface{}
	PendingRestart *bool
	CreatedAt      time.Time
	UpdatedAt      *time.Time
}

type CreateServerReq struct {
	ClusterID      int64
	ServerName     string
	ServerLocation *string
	IpAddress      string
}

type UpdateServerReq struct {
	ClusterID int64
	IpAddress string

	Name           string
	Role           *string
	Status         *string
	Timeline       *int64
	Lag            *int64
	Tags           interface{}
	PendingRestart *bool
}
