package patroni

import (
	"context"
	"crypto/tls"
	"encoding/json"
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
		httpClient: &http.Client{Timeout: time.Second},
		httpsClient: &http.Client{
			Timeout: time.Second,
			Transport: &http.Transport{
				TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
			},
		},
	}
}

// getJSON tries HTTPS first (with insecure TLS), then falls back to HTTP if HTTPS request fails.
func (c pClient) getJSON(ctx context.Context, host, path string, out interface{}) error {
	cid := ctx.Value(tracer.CtxCidKey{}).(string)
	localLog := c.log.With().Str("cid", cid).Logger()
	// Try HTTPS first
	httpsURL := "https://" + host + ":8008" + path
	reqHTTPS, err := http.NewRequestWithContext(ctx, http.MethodGet, httpsURL, nil)
	if err == nil {
		localLog.Trace().Str("request", "GET "+httpsURL).Msg("call request (https)")
		resp, err := c.httpsClient.Do(reqHTTPS)
		if err == nil {
			body, rerr := io.ReadAll(resp.Body)
			// Ensure body closed before any fallback
			cerr := resp.Body.Close()
			if cerr != nil {
				localLog.Error().Err(cerr).Msg("failed to close body")
			}
			if rerr != nil {
				localLog.Debug().Err(rerr).Str("request", "GET "+httpsURL).Msg("https read body failed, falling back to http")
			} else {
				localLog.Trace().Str("response", string(body)).Msg("got response (https)")
				if resp.StatusCode >= 200 && resp.StatusCode < 300 {
					if uerr := json.Unmarshal(body, out); uerr == nil {
						return nil
					}
					localLog.Debug().Str("request", "GET "+httpsURL).Msg("https json unmarshal failed, falling back to http")
				} else {
					localLog.Debug().Int("status", resp.StatusCode).Str("request", "GET "+httpsURL).Msg("https non-2xx, falling back to http")
				}
			}
		}
		// HTTPS request failed – fall back to HTTP
		localLog.Debug().Err(err).Str("request", "GET "+httpsURL).Msg("https request failed, falling back to http")
	} else {
		// Building HTTPS request failed – fall back to HTTP
		localLog.Debug().Err(err).Str("request", "GET "+httpsURL).Msg("failed to build https request, falling back to http")
	}

	// HTTP fallback
	httpURL := "http://" + host + ":8008" + path
	reqHTTP, err := http.NewRequestWithContext(ctx, http.MethodGet, httpURL, nil)
	if err != nil {
		return err
	}
	localLog.Trace().Str("request", "GET "+httpURL).Msg("call request (http)")
	resp, err := c.httpClient.Do(reqHTTP)
	if err != nil {
		return err
	}
	defer func() {
		derr := resp.Body.Close()
		if derr != nil {
			localLog.Error().Err(derr).Msg("failed to close body")
		}
	}()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	localLog.Trace().Str("response", string(body)).Msg("got response (http)")
	return json.Unmarshal(body, out)
}

func (c pClient) GetMonitoringInfo(ctx context.Context, host string) (*MonitoringInfo, error) {
	var monitoringInfo MonitoringInfo
	if err := c.getJSON(ctx, host, "/patroni", &monitoringInfo); err != nil {
		return nil, err
	}
	return &monitoringInfo, nil
}

func (c pClient) GetClusterInfo(ctx context.Context, host string) (*ClusterInfo, error) {
	var clusterInfo ClusterInfo
	if err := c.getJSON(ctx, host, "/cluster", &clusterInfo); err != nil {
		return nil, err
	}
	return &clusterInfo, nil
}
