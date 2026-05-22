package configuration

import (
	"os"
	"path/filepath"
	"testing"
)

const testPrefix = "PG_CONSOLE_TEST"

func writeSecret(t *testing.T, dir, name, content string) string {
	t.Helper()
	p := filepath.Join(dir, name)
	if err := os.WriteFile(p, []byte(content), 0o600); err != nil {
		t.Fatalf("write secret: %v", err)
	}
	return p
}

func TestResolveFileSecrets_ReadsFileIntoBaseVar(t *testing.T) {
	dir := t.TempDir()
	path := writeSecret(t, dir, "token", "s3cret\n")
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN_FILE", path)
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN", "")

	if err := resolveFileSecrets(testPrefix); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got := os.Getenv(testPrefix + "_AUTHORIZATION_TOKEN"); got != "s3cret" {
		t.Fatalf("expected trimmed secret 's3cret', got %q", got)
	}
}

func TestResolveFileSecrets_TrimsCRLF(t *testing.T) {
	dir := t.TempDir()
	path := writeSecret(t, dir, "token", "s3cret\r\n")
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN_FILE", path)
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN", "")

	if err := resolveFileSecrets(testPrefix); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got := os.Getenv(testPrefix + "_AUTHORIZATION_TOKEN"); got != "s3cret" {
		t.Fatalf("expected CRLF trim to yield 's3cret', got %q", got)
	}
}

func TestResolveFileSecrets_PreservesInternalNewlines(t *testing.T) {
	dir := t.TempDir()
	path := writeSecret(t, dir, "key", "line1\nline2\n")
	t.Setenv(testPrefix+"_ENCRYPTIONKEY_FILE", path)
	t.Setenv(testPrefix+"_ENCRYPTIONKEY", "")

	if err := resolveFileSecrets(testPrefix); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got := os.Getenv(testPrefix + "_ENCRYPTIONKEY"); got != "line1\nline2" {
		t.Fatalf("only trailing newline should be trimmed, got %q", got)
	}
}

func TestResolveFileSecrets_ConflictErrors(t *testing.T) {
	dir := t.TempDir()
	path := writeSecret(t, dir, "token", "from-file")
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN_FILE", path)
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN", "from-env")

	if err := resolveFileSecrets(testPrefix); err == nil {
		t.Fatalf("expected conflict error when both var and _FILE are set")
	}
}

func TestResolveFileSecrets_MissingFileErrors(t *testing.T) {
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN_FILE", "/nonexistent/path/to/secret")
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN", "")

	if err := resolveFileSecrets(testPrefix); err == nil {
		t.Fatalf("expected error when secret file is missing")
	}
}

func TestResolveFileSecrets_NoopWhenFileVarUnset(t *testing.T) {
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN", "stays")

	if err := resolveFileSecrets(testPrefix); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got := os.Getenv(testPrefix + "_AUTHORIZATION_TOKEN"); got != "stays" {
		t.Fatalf("expected base var to remain 'stays', got %q", got)
	}
}

func TestResolveFileSecrets_IgnoresOtherPrefixes(t *testing.T) {
	dir := t.TempDir()
	path := writeSecret(t, dir, "x", "value")
	t.Setenv("UNRELATED_TOKEN_FILE", path)
	t.Setenv("UNRELATED_TOKEN", "")

	if err := resolveFileSecrets(testPrefix); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got := os.Getenv("UNRELATED_TOKEN"); got != "" {
		t.Fatalf("expected unrelated prefix to be left alone, got %q", got)
	}
}

func TestResolveFileSecrets_EmptyFileVarSkipped(t *testing.T) {
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN_FILE", "")
	t.Setenv(testPrefix+"_AUTHORIZATION_TOKEN", "kept")

	if err := resolveFileSecrets(testPrefix); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got := os.Getenv(testPrefix + "_AUTHORIZATION_TOKEN"); got != "kept" {
		t.Fatalf("expected base var to be preserved when _FILE is empty, got %q", got)
	}
}

func TestRedacted_MasksSecrets(t *testing.T) {
	c := Config{}
	c.Authorization.Token = "super-secret-token"
	c.Db.Password = "super-secret-pw"
	c.EncryptionKey = "super-secret-key"
	c.Db.Host = "localhost"

	r := c.Redacted()
	if r.Authorization.Token != "[REDACTED]" {
		t.Errorf("token not redacted: %q", r.Authorization.Token)
	}
	if r.Db.Password != "[REDACTED]" {
		t.Errorf("password not redacted: %q", r.Db.Password)
	}
	if r.EncryptionKey != "[REDACTED]" {
		t.Errorf("encryption key not redacted: %q", r.EncryptionKey)
	}
	if r.Db.Host != "localhost" {
		t.Errorf("non-secret field altered: %q", r.Db.Host)
	}
	if c.Authorization.Token != "super-secret-token" {
		t.Errorf("Redacted mutated the receiver: %q", c.Authorization.Token)
	}
}

func TestRedacted_EmptyShowsUnset(t *testing.T) {
	c := Config{}
	r := c.Redacted()
	if r.Authorization.Token != "[unset]" {
		t.Errorf("expected [unset] for empty token, got %q", r.Authorization.Token)
	}
}
