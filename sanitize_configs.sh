#!/bin/bash
# Script to sanitize configuration files by removing sensitive information

set -e

CONFIGS=(
  "test_standby_cluster.yml"
  "tests/test_s3_backup.yml"
)

echo "Sanitizing configuration files..."

for config in "${CONFIGS[@]}"; do
  if [ -f "$config" ]; then
    echo "Processing: $config"
    
    # Create backup with .bak extension
    cp "$config" "$config.bak"
    
    # Sanitize password fields
    sed -i 's/password: ".*"/password: "your_postgres_password_here"/g' "$config"
    
    # Sanitize AWS access keys
    sed -i 's/access_key: ".*"/access_key: ""/g' "$config"
    sed -i 's/secret_key: ".*"/secret_key: ""/g' "$config"
    
    # Add comment about environment variables
    sed -i '/secret_key:/a\    # Use environment variables for credentials - DO NOT hardcode values here\n    # Export these variables before running the tests:\n    # export AWS_ACCESS_KEY_ID=your_access_key\n    # export AWS_SECRET_ACCESS_KEY=your_secret_key' "$config"
    
    # Sanitize any IP addresses (with exceptions for localhost and private ranges)
    sed -i 's/host: "\([0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\)"/host: "your_database_host_here"/g' "$config"
    
    # Restore localhost and private IPs
    sed -i 's/host: "your_database_host_here"/host: "localhost"/g' "$config"
    sed -i 's/host: "your_database_host_here"/host: "127.0.0.1"/g' "$config"
    
    echo "✅ Sanitized: $config"
    echo "   Backup saved as: $config.bak"
  else
    echo "⚠️  Config file not found: $config"
  fi
done

echo ""
echo "Configuration files sanitized. Original files backed up with .bak extension."
echo "Please verify the sanitized files before committing to version control." 