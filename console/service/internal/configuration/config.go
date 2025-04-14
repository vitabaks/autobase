package configuration

import (
	"fmt"
	"time"

	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	Logger struct {
		Level string `default:"DEBUG" desc:"Log level. Accepted values: [TRACE, DEBUG, INFO, WARN, ERROR, FATAL, PANIC]"`
	}
	Http struct {
		Host         string        `default:"0.0.0.0" desc:"Accepted host for connection. '0.0.0.0' for all hosts"`
		Port         int           `default:"8080" desc:"Listening port"`
		WriteTimeout time.Duration `default:"10s" desc:"Maximum duration before timing out write of the response"`
		ReadTimeout  time.Duration `default:"10s" desc:"Maximum duration before timing out read of the request"`
	}
	Https struct {
		IsUsed     bool   `default:"false" desc:"Flag for turn on/off https"`
		Host       string `default:"0.0.0.0" desc:"Accepted host for connection. '0.0.0.0' for all hosts"`
		Port       int    `default:"8081" desc:"Listening port"`
		CACert     string `default:"/etc/pg_console/cacert.pem" desc:"The certificate to use for secure connections"`
		ServerCert string `default:"/etc/pg_console/server-cert.pem" desc:"The certificate authority file to be used with mutual tls auth"`
		ServerKey  string `default:"/etc/pg_console/server-key.pem" desc:"The private key to use for secure connections"`
	}
	Authorization struct {
		Token string `default:"auth_token" desc:"Authorization token for REST API"`
	}
	Db struct {
		Host            string        `default:"localhost" desc:"Database host"`
		Port            uint16        `default:"5432" desc:"Database port"`
		DbName          string        `default:"postgres" desc:"Database name"`
		User            string        `default:"postgres" desc:"Database user name"`
		Password        string        `default:"postgres-pass" desc:"Database user password"`
		MaxConns        int32         `default:"10" desc:"MaxConns is the maximum size of the pool"`
		MaxConnLifeTime time.Duration `default:"60s" desc:"MaxConnLifetime is the duration since creation after which a connection will be automatically closed"`
		MaxConnIdleTime time.Duration `default:"60s" desc:"MaxConnIdleTime is the duration after which an idle connection will be automatically closed by the health check"`
		MigrationDir    string        `default:"/etc/db/migrations" desc:"Path to directory with migration scripts"`
	}
	EncryptionKey string `default:"super_secret" desc:"Encryption key for secret storage"`
	Docker        struct {
		Host   string `default:"unix:///var/run/docker.sock" desc:"Docker host"`
		LogDir string `default:"/tmp/ansible" desc:"Directory inside docker container for ansible json log"`
		Image  string `default:"autobase/automation:2.2.0" desc:"Docker image for autobase automation"`
	}
	LogWatcher struct {
		RunEvery    time.Duration `default:"1m" desc:"LogWatcher run interval"`
		AnalyzePast time.Duration `default:"48h" desc:"LogWatcher gets operations to analyze which created_at > now() - AnalyzePast"`
	}
	ClusterWatcher struct {
		RunEvery time.Duration `default:"1m" desc:"ClusterWatcher run interval"`
		PoolSize int64         `default:"4" desc:"Amount of async request from ClusterWatcher"`
	}
}

const cfgPrefix = "PG_CONSOLE"

func ReadConfig() (*Config, error) {
	cfg := Config{}

	err := envconfig.Process(cfgPrefix, &cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to parse config: %s", err.Error())
	}

	return &cfg, nil
}

func PrintUsage() {
	cfg := Config{}
	err := envconfig.Usage(cfgPrefix, &cfg)
	if err != nil {
		fmt.Printf("failed to print envconfig usage: %s", err.Error())
	}
}
