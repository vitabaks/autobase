#!/bin/bash
# Master script to test all three modules: Standby Cluster, Cloudflare, and S3 Backup

set -e

# Define colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${YELLOW}======================================================${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${YELLOW}======================================================${NC}\n"
}

print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2 tests passed successfully!${NC}"
    else
        echo -e "${RED}❌ $2 tests failed!${NC}"
        exit 1
    fi
}

# Print welcome message
print_header "Testing Autobase Modules: Standby, Cloudflare, and S3 Backup"

# Check if test files exist
for file in test_standby_cluster.sh test_cloudflare.sh test_s3_backup.sh; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Test script $file not found!${NC}"
        exit 1
    fi
    # Make the file executable
    chmod +x $file
done

# Test Standby Cluster
print_header "Testing Standby Cluster Module"
./test_standby_cluster.sh
result=$?
print_result $result "Standby Cluster"

# Test Cloudflare Integration
print_header "Testing Cloudflare Integration Module"
./test_cloudflare.sh
result=$?
print_result $result "Cloudflare Integration"

# Test S3 Backup
print_header "Testing S3 Backup Module"
./test_s3_backup.sh
result=$?
print_result $result "S3 Backup"

# Print final results
print_header "All Tests Completed Successfully!"
echo "The following modules have been tested and are working correctly:"
echo "1. Standby Cluster"
echo "2. Cloudflare Integration"
echo "3. S3 Backup"
echo -e "\nYour Autobase system is now fully verified!" 