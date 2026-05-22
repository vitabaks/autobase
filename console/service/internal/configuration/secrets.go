package configuration

import (
	"fmt"
	"os"
	"strings"
)

// resolveFileSecrets implements the Docker `_FILE` convention used by official
// images such as postgres and mysql. For every environment variable named
// `<prefix>_..._FILE`, the file at that path is read and its contents are used
// as the value of the corresponding base variable (with `_FILE` stripped).
//
// If both the base variable and its `_FILE` counterpart are set to non-empty
// values an error is returned, mirroring the postgres image's behavior. A
// single trailing newline (optionally preceded by `\r`) is trimmed from the
// file contents, since Docker secret files commonly include one.
func resolveFileSecrets(prefix string) error {
	suffix := "_FILE"
	for _, kv := range os.Environ() {
		eq := strings.IndexByte(kv, '=')
		if eq < 0 {
			continue
		}
		key, path := kv[:eq], kv[eq+1:]
		if path == "" {
			continue
		}
		if !strings.HasPrefix(key, prefix+"_") || !strings.HasSuffix(key, suffix) {
			continue
		}
		base := strings.TrimSuffix(key, suffix)
		if existing, ok := os.LookupEnv(base); ok && existing != "" {
			return fmt.Errorf("both %s and %s are set; choose one", base, key)
		}

		data, err := os.ReadFile(path)
		if err != nil {
			return fmt.Errorf("failed to read secret file for %s: %w", key, err)
		}
		value := strings.TrimSuffix(string(data), "\n")
		value = strings.TrimSuffix(value, "\r")
		if err := os.Setenv(base, value); err != nil {
			return fmt.Errorf("failed to set %s from %s: %w", base, key, err)
		}
	}
	return nil
}
