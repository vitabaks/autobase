#!/bin/bash
# Test script for standby cluster and S3 backup functionality

set -e

# Load test configuration
CONFIG_FILE="test_standby_cluster.yml"
PRIMARY_HOST=$(grep -A2 "primary_cluster:" $CONFIG_FILE | grep "host:" | awk -F'"' '{print $2}')
PRIMARY_PORT=$(grep -A3 "primary_cluster:" $CONFIG_FILE | grep "port:" | awk '{print $2}')
S3_BUCKET=$(grep -A2 "s3_backup:" $CONFIG_FILE | grep "bucket:" | awk -F'"' '{print $2}')
S3_REGION=$(grep -A2 "region:" $CONFIG_FILE | grep "region:" | awk -F'"' '{print $2}')

# Get PostgreSQL password from config file or use default if not found
PG_PASSWORD=$(grep -A10 "primary_cluster:" $CONFIG_FILE | grep "password:" | awk -F'"' '{print $2}')
if [ -z "$PG_PASSWORD" ]; then
    # If password not found in config file, ask user for it
    echo "PostgreSQL password not found in config. Please enter password for user 'postgres':"
    read -s PG_PASSWORD
    echo ""
fi

# Export password for psql commands
export PGPASSWORD=$PG_PASSWORD

# Check for AWS credentials in environment variables
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "AWS credentials not found in environment variables."
    echo "Please set them before running this script:"
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

# Set AWS default region if not already set
export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION:-$S3_REGION}

echo "==== Testing Standby Cluster with S3 Backup ===="
echo "Primary host: $PRIMARY_HOST:$PRIMARY_PORT"
echo "S3 bucket: $S3_BUCKET"
echo "AWS region: $AWS_DEFAULT_REGION"

# Function to execute SQL on primary
run_sql_primary() {
    echo "Executing on primary: $1"
    psql -h $PRIMARY_HOST -p $PRIMARY_PORT -U postgres -c "$1"
}

# Function to execute SQL on standby leader
run_sql_standby() {
    # Get the standby leader IP from Patroni API
    STANDBY_LEADER=$(curl -s http://$PRIMARY_HOST:8008/standby-leader | jq -r '.ip')
    echo "Executing on standby leader ($STANDBY_LEADER): $1"
    psql -h $STANDBY_LEADER -p $PRIMARY_PORT -U postgres -c "$1"
}

echo "==== 1. Testing Basic Replication ===="

# Create test table on primary
echo "Creating test table on primary..."
run_sql_primary "CREATE TABLE IF NOT EXISTS standby_test (id SERIAL PRIMARY KEY, name TEXT, created_at TIMESTAMPTZ DEFAULT NOW());"

# Insert data
echo "Inserting test data..."
run_sql_primary "INSERT INTO standby_test (name) VALUES ('test_record_1'), ('test_record_2'), ('test_record_3');"

# Wait for replication to catch up
echo "Waiting for replication lag to clear..."
sleep 5

# Verify data on standby
echo "Verifying data on standby..."
standby_count=$(run_sql_standby "SELECT COUNT(*) FROM standby_test;" | grep -A 1 "count" | tail -n 1 | tr -d ' ')
echo "Records found on standby: $standby_count"

if [ "$standby_count" -ge 3 ]; then
    echo "✅ Basic replication test passed!"
else
    echo "❌ Basic replication test failed! Expected at least 3 records."
    exit 1
fi

echo "==== 2. Testing S3 Backup and Restore ===="

# Find the patroni user's home directory
PATRONI_HOME=$(sudo -u postgres bash -c 'echo $HOME')

# Check S3 backup script exists
if [ ! -f "/usr/local/bin/s3_backup.sh" ]; then
    echo "❌ S3 backup script not found!"
    exit 1
fi

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
if aws s3 ls s3://$S3_BUCKET/ | grep -q "backup"; then
    echo "✅ Found backup in S3!"
else
    echo "❌ Backup not found in S3 bucket!"
    exit 1
fi

echo "==== 3. Testing WAL Archiving ===="

# Force WAL switch
echo "Forcing WAL switch on primary..."
run_sql_primary "SELECT pg_switch_wal();"

# Wait for archiving
echo "Waiting for WAL archiving..."
sleep 5

# Check WAL archiving to S3
echo "Checking WAL files in S3..."
if aws s3 ls s3://$S3_BUCKET/wal/ | grep -q ""; then
    echo "✅ Found WAL files in S3!"
else
    echo "❌ WAL files not found in S3 bucket!"
    exit 1
fi

echo "==== All tests completed successfully! ====" 