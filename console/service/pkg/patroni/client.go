package patroni

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"postgresql-cluster-console/pkg/tracer"
	"time"

	"github.com/rs/zerolog"
)

type IClient interface {
	GetMonitoringInfo(ctx context.Context, host string) (*MonitoringInfo, error)
	GetClusterInfo(ctx context.Context, host string) (*ClusterInfo, error)
}

type pClient struct {
	log         zerolog.Logger
	httpClient  *http.Client
	httpsClient *http.Client
}

func NewClient(log zerolog.Logger) IClient {
	return pClient{
		log:        log,
		httpClient: &http.Client{Timeout: 2 * time.Second},
		httpsClient: &http.Client{
			Timeout: 2 * time.Second,
			Transport: &http.Transport{
				TLSClientConfig: &tls.Config{InsecureSkipVerify: true}, //nolint:gosec // to allow self-signed certs
			},
		},
	}
}

// getJSON - tries HTTPS first, then falls back to HTTP if HTTPS request fails.
func (c pClient) getJSON(ctx context.Context, host, path string, out interface{}) error {
	cid, _ := ctx.Value(tracer.CtxCidKey{}).(string)
	localLog := c.log
	if cid != "" {
		localLog = localLog.With().Str("cid", cid).Logger()
	}

	// Try HTTPS first
	httpsURL := "https://" + host + ":8008" + path
	reqHTTPS, err := http.NewRequestWithContext(ctx, http.MethodGet, httpsURL, nil)
	var httpsErr error
	if err == nil {
		localLog.Trace().Str("request", "GET "+httpsURL).Msg("call request (https)")
		resp, err := c.httpsClient.Do(reqHTTPS)
		if err == nil {
			body, rerr := io.ReadAll(resp.Body)
			_ = resp.Body.Close()

			if rerr == nil && resp.StatusCode >= 200 && resp.StatusCode < 300 {
				localLog.Trace().Int("status", resp.StatusCode).Str("response", string(body)).Msg("got response (https)")
				if uerr := json.Unmarshal(body, out); uerr == nil {
					return nil
				}
				localLog.Debug().Msg("https json unmarshal failed, falling back to http")
			} else {
				localLog.Debug().Int("status", resp.StatusCode).Msg("https non-2xx, falling back to http")
			}
		} else {
			httpsErr = err
			localLog.Debug().Err(err).Msg("https request failed, falling back to http")
		}
	} else {
		httpsErr = err
		localLog.Debug().Err(err).Msg("failed to build https request, falling back to http")
	}

	// HTTP fallback
	httpURL := "http://" + host + ":8008" + path
	reqHTTP, err := http.NewRequestWithContext(ctx, http.MethodGet, httpURL, nil)
	if err != nil {
		if httpsErr != nil {
			return fmt.Errorf("http fallback failed after https: %w", httpsErr)
		}
		return err
	}

	localLog.Trace().Str("request", "GET "+httpURL).Msg("call request (http)")
	resp, err := c.httpClient.Do(reqHTTP)
	if err != nil {
		if httpsErr != nil {
			return fmt.Errorf("http fallback failed after https: %w", httpsErr)
		}
		return err
	}
	defer func() {
		if derr := resp.Body.Close(); derr != nil {
			localLog.Error().Err(derr).Msg("failed to close body")
		}
	}()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	localLog.Trace().Int("status", resp.StatusCode).Str("response", string(body)).Msg("got response (http)")
	return json.Unmarshal(body, out)
}

// GetMonitoringInfo
func (c pClient) GetMonitoringInfo(ctx context.Context, host string) (*MonitoringInfo, error) {
	var monitoringInfo MonitoringInfo
	if err := c.getJSON(ctx, host, "/patroni", &monitoringInfo); err != nil {
		return nil, err
	}
	return &monitoringInfo, nil
}

// GetClusterInfo
func (c pClient) GetClusterInfo(ctx context.Context, host string) (*ClusterInfo, error) {
	var clusterInfo ClusterInfo
	if err := c.getJSON(ctx, host, "/cluster", &clusterInfo); err != nil {
		return nil, err
	}
	return &clusterInfo, nil
}
