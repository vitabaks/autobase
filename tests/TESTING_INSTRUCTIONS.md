# Testing Instructions for Autobase Modules

This document provides step-by-step instructions for testing the Standby Cluster, Cloudflare, and S3 Backup modules in your Autobase system.

## Prerequisites

Before running the tests, ensure you have:

1. A working primary PostgreSQL cluster
2. SSH access to the PostgreSQL servers
3. AWS CLI tools installed (`aws`)
4. PostgreSQL client tools installed (`psql`)
5. jq utility installed (`jq`)
6. curl utility installed (`curl`)

## Fixing Connection Issues

If you encounter connection errors like:
```
failed: FATAL: password authentication failed for user "postgres"
failed: FATAL: no pg_hba.conf entry for host "x.x.x.x", user "postgres", database "postgres", no encryption
```

Follow these steps:

1. Make all scripts executable:
   ```bash
   chmod +x *.sh 
   ```

2. Update your PostgreSQL password in `test_standby_cluster.yml`:
   ```yaml
   primary_cluster:
     # ...
     password: ""  # Replace with your actual password
   ```

3. Run the pg_hba.conf update script to allow your IP to connect:
   ```bash
   ./update_pg_hba.sh
   ```
   This script will:
   - Detect your public IP address
   - Add an entry in pg_hba.conf to allow connections from your IP
   - Reload the PostgreSQL configuration

## Testing Individual Modules

### Testing Standby Cluster

1. Edit `test_standby_cluster.yml` to match your environment:
   - Update `primary_cluster.host` with your primary PostgreSQL server IP
   - Update `primary_cluster.password` with the correct password
   - Update S3 credentials and bucket information

2. Run the standby cluster test:
   ```bash
   ./test_standby_cluster.sh
   ```

### Testing Cloudflare Integration

1. Edit `test_cloudflare.yml` to match your environment:
   - Update Cloudflare API token, zone ID, and account ID
   - Update domain and cluster information

2. Run the Cloudflare test:
   ```bash
   ./test_cloudflare.sh
   ```

### Testing S3 Backup

1. Edit `test_s3_backup.yml` to match your environment:
   - Update S3 bucket, region, and credentials
   - Update PostgreSQL connection details

2. Run the S3 backup test:
   ```bash
   ./test_s3_backup.sh
   ```

## Testing All Modules Together

If you want to test all modules at once, run:

```bash
./test_all_modules.sh
```

This will execute all three test scripts in sequence.

## Troubleshooting

If you encounter issues during testing:

1. **Connection issues**: Make sure PostgreSQL is configured to accept remote connections and your IP is allowed in pg_hba.conf
2. **Permission issues**: Ensure you're using the correct passwords and API tokens
3. **S3 access issues**: Verify your AWS credentials and bucket permissions
4. **Script execution issues**: Make sure all scripts are executable with `chmod +x *.sh`

For S3 credentials issues, you can set environment variables:
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=your_region
```

## Notes

These tests should be run against a test environment, not production, as they create test tables and data.

If you need to test against a production system, consider creating a separate database for testing or modifying the scripts to use a test-specific schema. 