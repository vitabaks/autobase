package authinfo

import (
	"errors"
	"fmt"
	"strings"

	"postgresql-cluster-console/internal/storage"
)

var cloudSecretTypes = map[string]struct{}{
	"aws":          {},
	"gcp":          {},
	"azure":        {},
	"digitalocean": {},
	"hetzner":      {},
}

// ValidateSecretReference ensures that a stored secret belongs to the cluster project
// and is valid for the requested local or cloud deployment.
func ValidateSecretReference(secret *storage.SecretView, projectID int64, cloudProvider string) error {
	if secret == nil {
		return errors.New("secret not found")
	}
	if secret.ProjectID != projectID {
		return fmt.Errorf("secret %d does not belong to project %d", secret.ID, projectID)
	}

	cloudProvider = strings.ToLower(strings.TrimSpace(cloudProvider))
	if cloudProvider == "" {
		switch secret.Type {
		case "ssh_key", "password":
			return nil
		default:
			return fmt.Errorf("server secret %d has unsupported type %q", secret.ID, secret.Type)
		}
	}

	if _, ok := cloudSecretTypes[cloudProvider]; !ok {
		return fmt.Errorf("unsupported cloud provider %q", cloudProvider)
	}
	if secret.Type != cloudProvider {
		return fmt.Errorf("cloud secret %d has type %q, expected %q", secret.ID, secret.Type, cloudProvider)
	}

	return nil
}
