package authinfo

import (
	"strings"
	"testing"

	"postgresql-cluster-console/internal/storage"
)

func TestValidateSecretReference(t *testing.T) {
	tests := []struct {
		name          string
		secretType    string
		projectID     int64
		cloudProvider string
		wantError     string
	}{
		{name: "ssh key for local deployment", secretType: "ssh_key", projectID: 1},
		{name: "password for local deployment", secretType: "password", projectID: 1},
		{name: "aws credentials for aws", secretType: "aws", projectID: 1, cloudProvider: "aws"},
		{name: "cloud provider is normalized", secretType: "aws", projectID: 1, cloudProvider: " AWS "},
		{name: "gcp credentials for gcp", secretType: "gcp", projectID: 1, cloudProvider: "gcp"},
		{name: "azure credentials for azure", secretType: "azure", projectID: 1, cloudProvider: "azure"},
		{name: "digitalocean credentials for digitalocean", secretType: "digitalocean", projectID: 1, cloudProvider: "digitalocean"},
		{name: "hetzner credentials for hetzner", secretType: "hetzner", projectID: 1, cloudProvider: "hetzner"},
		{name: "reject cloud credentials for local deployment", secretType: "aws", projectID: 1, wantError: "unsupported type"},
		{name: "reject server credentials for cloud deployment", secretType: "ssh_key", projectID: 1, cloudProvider: "aws", wantError: "expected"},
		{name: "reject credentials for another cloud provider", secretType: "aws", projectID: 1, cloudProvider: "gcp", wantError: "expected"},
		{name: "reject unsupported cloud provider", secretType: "aws", projectID: 1, cloudProvider: "unknown", wantError: "unsupported cloud provider"},
		{name: "reject secret from another project", secretType: "ssh_key", projectID: 2, wantError: "does not belong to project"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			secret := &storage.SecretView{ID: 7, ProjectID: 1, Type: tt.secretType}
			err := ValidateSecretReference(secret, tt.projectID, tt.cloudProvider)
			if tt.wantError == "" {
				if err != nil {
					t.Fatalf("ValidateSecretReference() error = %v", err)
				}
				return
			}
			if err == nil || !strings.Contains(err.Error(), tt.wantError) {
				t.Fatalf("ValidateSecretReference() error = %v, want error containing %q", err, tt.wantError)
			}
		})
	}
}

func TestValidateSecretReferenceRejectsMissingSecret(t *testing.T) {
	err := ValidateSecretReference(nil, 1, "")
	if err == nil || err.Error() != "secret not found" {
		t.Fatalf("ValidateSecretReference() error = %v, want secret not found", err)
	}
}
