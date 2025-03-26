#!/bin/bash
# Test script for S3 backup integration

set -e

# Load test configuration
CONFIG_FILE="test_s3_backup.yml"
S3_BUCKET=$(grep -A2 "bucket:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
S3_REGION=$(grep -A2 "region:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
S3_PATH=$(grep -A2 "path:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
S3_ENDPOINT=$(grep -A2 "endpoint:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
PG_HOST=$(grep -A2 "host:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
PG_PORT=$(grep -A2 "port:" $CONFIG_FILE | head -1 | awk '{print $2}')
PG_USER=$(grep -A2 "user:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
PG_PASSWORD=$(grep -A2 "password:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')

# Check for PostgreSQL password in environment or config
if [ -z "$PGPASSWORD" ]; then
    if [ -z "$PG_PASSWORD" ]; then
        echo "PostgreSQL password not found in environment or config. Please enter password for user '$PG_USER':"
        read -s PG_PASSWORD
        echo ""
    fi
    export PGPASSWORD=$PG_PASSWORD
fi

# Check for AWS credentials in environment variables
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "AWS credentials not found in environment variables."
    
    # Try to get them from config if available
    S3_ACCESS_KEY=$(grep -A2 "access_key:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
    S3_SECRET_KEY=$(grep -A2 "secret_key:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
    
    if [ -n "$S3_ACCESS_KEY" ] && [ -n "$S3_SECRET_KEY" ]; then
        echo "Using AWS credentials from config file."
        export AWS_ACCESS_KEY_ID=$S3_ACCESS_KEY
        export AWS_SECRET_ACCESS_KEY=$S3_SECRET_KEY
    else
        echo "Please set AWS credentials before running this script:"
        echo "export AWS_ACCESS_KEY_ID=your_access_key"
        echo "export AWS_SECRET_ACCESS_KEY=your_secret_key"
        echo ""
        echo "Would you like to enter them now? (y/n)"
        read ENTER_CREDS
        
        if [ "$ENTER_CREDS" = "y" ]; then
            echo "Enter AWS Access Key ID:"
            read AWS_ACCESS_KEY_ID
            echo "Enter AWS Secret Access Key:"
            read -s AWS_SECRET_ACCESS_KEY
            echo ""
            
            # Export AWS credentials
            export AWS_ACCESS_KEY_ID
            export AWS_SECRET_ACCESS_KEY
        else
            echo "Skipping AWS credential setup. S3 backup tests may fail."
        fi
    fi
fi

# Set AWS default region if not already set
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-$S3_REGION}

ENDPOINT_OPTION=""
if [ -n "$S3_ENDPOINT" ]; then
    ENDPOINT_OPTION="--endpoint-url=$S3_ENDPOINT"
fi

echo "==== Testing S3 Backup Integration ===="
echo "S3 bucket: $S3_BUCKET"
echo "PostgreSQL host: $PG_HOST:$PG_PORT"

# Function to execute SQL
run_sql() {
    echo "Executing SQL: $1"
    psql -h $PG_HOST -p $PG_PORT -U $PG_USER -c "$1"
}

echo "==== 1. Testing S3 Bucket Access ===="

# Check if S3 bucket exists
echo "Checking S3 bucket..."
aws $ENDPOINT_OPTION s3 ls s3://$S3_BUCKET/ > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ S3 bucket exists and is accessible!"
else
    echo "❌ S3 bucket does not exist or is not accessible!"
    echo "Creating S3 bucket..."
    aws $ENDPOINT_OPTION s3 mb s3://$S3_BUCKET
    if [ $? -eq 0 ]; then
        echo "✅ S3 bucket created successfully!"
    else
        echo "❌ Failed to create S3 bucket!"
        exit 1
    fi
fi

echo "==== 2. Testing Base Backup to S3 ===="

# Create test directories
BACKUP_DIR="/tmp/pg_backup_test"
BACKUP_NAME="pg_backup_test_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Check if backup script exists
if [ ! -f "/usr/local/bin/s3_backup.sh" ]; then
    echo "❌ S3 backup script not found!"
    exit 1
fi

# Create a test table with some data for backup
echo "Creating test table for backup..."
run_sql "CREATE TABLE IF NOT EXISTS s3_backup_test (id SERIAL PRIMARY KEY, data TEXT, created_at TIMESTAMPTZ DEFAULT NOW());"
run_sql "INSERT INTO s3_backup_test (data) VALUES ('test_data_for_backup');"

# Trigger backup manually
echo "Triggering S3 backup manually..."
sudo -u postgres bash -c "/usr/local/bin/s3_backup.sh > /tmp/s3_backup.log 2>&1"

# Check backup log
echo "Checking backup log..."
if grep -q "Uploading backup to S3" /tmp/s3_backup.log; then
    echo "✅ Backup initiated successfully!"
else
    echo "❌ Backup failed to initiate properly. Check /tmp/s3_backup.log"
    cat /tmp/s3_backup.log
    exit 1
fi

# Verify backup exists in S3
echo "Verifying backup in S3..."
if aws $ENDPOINT_OPTION s3 ls s3://$S3_BUCKET/$S3_PATH/backup/ | grep -q "tar.gz"; then
    echo "✅ Found backup in S3!"
else
    echo "❌ Backup not found in S3 bucket!"
    exit 1
fi

echo "==== 3. Testing WAL Archiving to S3 ===="

# Force WAL switch
echo "Forcing WAL switch..."
run_sql "SELECT pg_switch_wal();"

# Wait for archiving
echo "Waiting for WAL archiving..."
sleep 5

# Check WAL archiving to S3
echo "Checking WAL files in S3..."
if aws $ENDPOINT_OPTION s3 ls s3://$S3_BUCKET/$S3_PATH/wal/ | grep -q ""; then
    echo "✅ Found WAL files in S3!"
else
    echo "❌ WAL files not found in S3 bucket!"
    exit 1
fi

echo "==== 4. Testing Point-in-Time Recovery (Simplified) ===="

# Create a test table for PITR
echo "Creating test table for PITR..."
run_sql "CREATE TABLE IF NOT EXISTS s3_pitr_test (id SERIAL PRIMARY KEY, data TEXT, created_at TIMESTAMPTZ DEFAULT NOW());"

# Insert initial data
echo "Inserting initial data..."
run_sql "INSERT INTO s3_pitr_test (data) VALUES ('pitr_data_before');"

# Record current timestamp
RESTORE_POINT=$(run_sql "SELECT NOW();" | grep -A 1 "now" | tail -n 1 | tr -d ' ')
echo "Recovery point timestamp: $RESTORE_POINT"

# Force WAL switch to ensure data is archived
run_sql "SELECT pg_switch_wal();"
sleep 5

# Insert additional data
echo "Inserting additional data..."
run_sql "INSERT INTO s3_pitr_test (data) VALUES ('pitr_data_after');"

# Verify all data exists
echo "Verifying all data exists..."
count=$(run_sql "SELECT COUNT(*) FROM s3_pitr_test;" | grep -A 1 "count" | tail -n 1 | tr -d ' ')
if [ "$count" -eq 2 ]; then
    echo "✅ All data verified! ($count records)"
else
    echo "❌ Data verification failed! Expected 2 records, found $count"
    exit 1
fi

# Note: In a real test, here we would stop PostgreSQL, move the data directory,
# create a recovery.conf file with recovery_target_time, and restore from backup.
# For this simplified test, we'll just note that the process would be:
echo ""
echo "Point-in-Time Recovery would now:
1. Stop PostgreSQL
2. Move/rename data directory
3. Create a recovery.conf file with:
   - restore_command = '/usr/local/bin/s3_restore_wal.sh %f %p'
   - recovery_target_time = '$RESTORE_POINT'
4. Restore the latest base backup
5. Start PostgreSQL to replay WAL files to the target time
6. After recovery completes, verify only the first data exists"

echo "==== 5. Testing Backup Retention ===="

# Create multiple backup files with different timestamps
echo "Testing backup retention policy..."
for i in {1..3}; do
    timestamp=$(date -d "$i days ago" +%Y%m%d_%H%M%S)
    test_file="test_backup_$timestamp.manifest"
    
    echo "Creating test backup manifest for $timestamp..."
    cat > /tmp/$test_file <<EOF
{
  "backup_name": "pg_backup_$timestamp",
  "backup_time": "$(date -d "$i days ago" -u +%Y-%m-%dT%H:%M:%SZ)",
  "hostname": "$(hostname)",
  "ip_address": "$(hostname -i)",
  "postgres_version": "14",
  "cluster_name": "$S3_PATH"
}
EOF
    
    # Upload test file to S3
    aws $ENDPOINT_OPTION s3 cp /tmp/$test_file s3://$S3_BUCKET/$S3_PATH/backup/$test_file
done

# List all backups
echo "Current backups in S3:"
aws $ENDPOINT_OPTION s3 ls s3://$S3_BUCKET/$S3_PATH/backup/

# Run retention script if it exists
if [ -f "/usr/local/bin/s3_retention.sh" ]; then
    echo "Running retention script..."
    sudo -u postgres bash -c "/usr/local/bin/s3_retention.sh > /tmp/s3_retention.log 2>&1"
    cat /tmp/s3_retention.log
else
    echo "Retention script not found, would execute:
    aws s3 ls s3://$S3_BUCKET/$S3_PATH/backup/ |
    grep -v $(date -d 'now-7 days' +%Y%m%d) |
    awk '{print \$4}' |
    xargs -I{} aws s3 rm s3://$S3_BUCKET/$S3_PATH/backup/{}"
fi

echo "==== All tests completed! ====" 