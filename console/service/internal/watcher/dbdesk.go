package watcher

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/rs/zerolog"
)

// dbDeskConnectionRequest represents payload for dbdesk-studio connection creation API.
type dbDeskConnectionRequest struct {
	Name    string                  `json:"name"`
	Type    string                  `json:"type"`
	Options dbDeskConnectionOptions `json:"options"`
}

// dbDeskConnectionOptions stores PostgreSQL connection parameters expected by dbdesk-studio.
type dbDeskConnectionOptions struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Database string `json:"database"`
	User     string `json:"user"`
	Password string `json:"password"`
	SSLMode  string `json:"sslMode"`
}

// registerClusterInDbDesk performs best-effort registration of a deployed cluster in dbdesk-studio.
// It validates connection info, checks dbdesk availability, and creates the connection profile.
func (lw *logWatcher) registerClusterInDbDesk(ctx context.Context, clusterName string, connectionInfo interface{}, localLog zerolog.Logger) {
	if !lw.cfg.DbDesk.Enabled {
		return
	}

	connReq, err := buildDbDeskConnectionRequest(clusterName, connectionInfo, lw.cfg.DbDesk.SSLMode)
	if err != nil {
		localLog.Warn().Err(err).Msg("skip dbdesk-studio registration: invalid connection info")
		return
	}

	httpClient := &http.Client{Timeout: lw.cfg.DbDesk.Timeout}

	if err = lw.checkDbDeskHealth(ctx, httpClient); err != nil {
		localLog.Warn().Err(err).Msg("dbdesk-studio is unavailable, skip registration")
		return
	}

	if err = lw.createDbDeskConnection(ctx, httpClient, connReq); err != nil {
		localLog.Warn().Err(err).Msg("failed to register cluster in dbdesk-studio")
		return
	}

	localLog.Info().Str("cluster", clusterName).Str("host", connReq.Options.Host).Int("port", connReq.Options.Port).Msg("cluster registered in dbdesk-studio")
}

// checkDbDeskHealth verifies that dbdesk-studio is reachable before trying to register a connection.
func (lw *logWatcher) checkDbDeskHealth(ctx context.Context, client *http.Client) error {
	healthURL, err := resolveURL(lw.cfg.DbDesk.URL, "/health")
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, healthURL, nil)
	if err != nil {
		return err
	}

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("health endpoint returned status %d", resp.StatusCode)
	}

	return nil
}

// createDbDeskConnection sends POST /api/connections request to dbdesk-studio.
func (lw *logWatcher) createDbDeskConnection(ctx context.Context, client *http.Client, payload *dbDeskConnectionRequest) error {
	connectionURL, err := resolveURL(lw.cfg.DbDesk.URL, "/api/connections")
	if err != nil {
		return err
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, connectionURL, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusCreated {
		return nil
	}

	respBody, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
	if len(respBody) == 0 {
		return fmt.Errorf("registration endpoint returned status %d", resp.StatusCode)
	}

	return fmt.Errorf("registration endpoint returned status %d: %s", resp.StatusCode, strings.TrimSpace(string(respBody)))
}

// buildDbDeskConnectionRequest converts generic connection_info into dbdesk-studio API payload.
func buildDbDeskConnectionRequest(clusterName string, rawConnectionInfo interface{}, sslMode string) (*dbDeskConnectionRequest, error) {
	connectionInfo, err := normalizeConnectionInfo(rawConnectionInfo)
	if err != nil {
		return nil, err
	}

	host := extractHost(connectionInfo)
	if len(host) == 0 {
		return nil, fmt.Errorf("host is empty")
	}

	port, ok := extractPort(connectionInfo)
	if !ok {
		return nil, fmt.Errorf("port is empty")
	}

	user, _ := asString(connectionInfo["superuser"])
	if len(user) == 0 {
		return nil, fmt.Errorf("superuser is empty")
	}

	password, _ := asString(connectionInfo["password"])

	return &dbDeskConnectionRequest{
		Name: clusterName,
		Type: "postgres",
		Options: dbDeskConnectionOptions{
			Host:     host,
			Port:     port,
			Database: "postgres",
			User:     user,
			Password: password,
			SSLMode:  sslMode,
		},
	}, nil
}

// normalizeConnectionInfo supports different storage formats (map, JSON string, JSON bytes).
func normalizeConnectionInfo(rawConnectionInfo interface{}) (map[string]interface{}, error) {
	switch raw := rawConnectionInfo.(type) {
	case map[string]interface{}:
		return raw, nil
	case []byte:
		decoded := map[string]interface{}{}
		if err := json.Unmarshal(raw, &decoded); err != nil {
			return nil, fmt.Errorf("failed to unmarshal connection_info bytes: %w", err)
		}
		return decoded, nil
	case string:
		decoded := map[string]interface{}{}
		if err := json.Unmarshal([]byte(raw), &decoded); err != nil {
			return nil, fmt.Errorf("failed to unmarshal connection_info string: %w", err)
		}
		return decoded, nil
	default:
		return nil, fmt.Errorf("unsupported connection_info type %T", rawConnectionInfo)
	}
}

// extractHost picks primary host from connection_info written by deploy_finish.
func extractHost(connectionInfo map[string]interface{}) string {
	for _, key := range []string{"address", "public_address"} {
		host := pickHost(connectionInfo[key])
		if len(host) > 0 {
			return host
		}
	}

	return ""
}

// extractPort picks primary port from connection_info written by deploy_finish.
func extractPort(connectionInfo map[string]interface{}) (int, bool) {
	return pickPort(connectionInfo["port"])
}

// pickHost parses host from deploy_finish formats.
func pickHost(raw interface{}) string {
	switch value := raw.(type) {
	case string:
		host := firstHostValue(value)
		if len(host) > 0 {
			return host
		}
	case []interface{}:
		if len(value) == 0 {
			return ""
		}
		host, _ := asString(value[0])
		return firstHostValue(host)
	case map[string]interface{}:
		for _, key := range []string{"primary"} {
			host, _ := asString(value[key])
			host = firstHostValue(host)
			if len(host) > 0 {
				return host
			}
		}
	}

	return ""
}

// pickPort parses port from deploy_finish formats.
func pickPort(raw interface{}) (int, bool) {
	switch value := raw.(type) {
	case float64:
		if value > 0 {
			return int(value), true
		}
	case int:
		if value > 0 {
			return value, true
		}
	case string:
		port, err := strconv.Atoi(strings.TrimSpace(value))
		if err == nil && port > 0 {
			return port, true
		}
	case map[string]interface{}:
		for _, key := range []string{"primary"} {
			if port, ok := pickPort(value[key]); ok {
				return port, true
			}
		}
	}

	return 0, false
}

func firstHostValue(raw string) string {
	parts := strings.Split(raw, ",")
	return strings.TrimSpace(parts[0])
}

// asString provides safe conversion for values that may come from decoded JSON.
func asString(value interface{}) (string, bool) {
	switch typed := value.(type) {
	case string:
		return typed, true
	case float64:
		return strconv.FormatFloat(typed, 'f', -1, 64), true
	case int:
		return strconv.Itoa(typed), true
	default:
		return "", false
	}
}

// resolveURL joins base dbdesk URL with endpoint path.
func resolveURL(baseURL, path string) (string, error) {
	base, err := url.Parse(baseURL)
	if err != nil {
		return "", fmt.Errorf("invalid dbdesk-studio URL: %w", err)
	}

	relativePath, err := url.Parse(path)
	if err != nil {
		return "", err
	}

	return base.ResolveReference(relativePath).String(), nil
}
