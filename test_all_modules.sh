#!/bin/bash
# Master script to run all test modules in sequence

set -e

# Define colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Initialize results array
declare -A TEST_RESULTS

# Function to run a test script and track its result
run_test() {
    local test_name=$1
    local test_script=$2
    
    echo -e "\n${YELLOW}=======================================================${NC}"
    echo -e "${YELLOW}Running test: ${test_name}${NC}"
    echo -e "${YELLOW}=======================================================${NC}"
    
    # Check if script exists
    if [ ! -f "$test_script" ]; then
        echo -e "${RED}Test script not found: $test_script${NC}"
        TEST_RESULTS["$test_name"]="SKIPPED (not found)"
        return
    fi
    
    # Make sure script is executable
    chmod +x "$test_script"
    
    # Run the test script
    if $test_script; then
        echo -e "\n${GREEN}✅ Test '$test_name' completed successfully!${NC}"
        TEST_RESULTS["$test_name"]="PASSED"
    else
        echo -e "\n${RED}❌ Test '$test_name' failed!${NC}"
        TEST_RESULTS["$test_name"]="FAILED"
    fi
}

# Load environment variables if available
if [ -f "./load_env.sh" ]; then
    echo "Loading environment variables..."
    source ./load_env.sh
else
    echo -e "${YELLOW}load_env.sh not found. Continuing without loading environment.${NC}"
    
    # Check for AWS credentials
    if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
        echo -e "${YELLOW}Warning: AWS credentials not found in environment.${NC}"
        echo "Some tests may fail or prompt for credentials."
    fi
    
    # Check for PostgreSQL password
    if [ -z "$PGPASSWORD" ]; then
        echo -e "${YELLOW}Warning: PGPASSWORD not found in environment.${NC}"
        echo "Some tests may fail or prompt for password."
    fi
fi

# Run all test modules
echo -e "\n${YELLOW}Starting test suite execution...${NC}"

# 1. S3 Backup Test
run_test "S3 Backup Integration" "./tests/test_s3_backup.sh"

# 2. Standby Cluster Test
run_test "Standby Cluster" "./test_standby_cluster.sh"

# Add more tests here as they become available
# run_test "Cloudflare Integration" "./tests/test_cloudflare.sh"
# run_test "Metrics Monitoring" "./tests/test_metrics.sh"

# Print summary of all test results
echo -e "\n${YELLOW}=======================================================${NC}"
echo -e "${YELLOW}Test Suite Summary${NC}"
echo -e "${YELLOW}=======================================================${NC}"

PASSED=0
FAILED=0
SKIPPED=0

for test_name in "${!TEST_RESULTS[@]}"; do
    result=${TEST_RESULTS["$test_name"]}
    
    if [ "$result" == "PASSED" ]; then
        echo -e "${GREEN}✅ $test_name: $result${NC}"
        ((PASSED++))
    elif [ "$result" == "FAILED" ]; then
        echo -e "${RED}❌ $test_name: $result${NC}"
        ((FAILED++))
    else
        echo -e "${YELLOW}⚠️ $test_name: $result${NC}"
        ((SKIPPED++))
    fi
done

echo -e "\n${YELLOW}Tests summary: $PASSED passed, $FAILED failed, $SKIPPED skipped${NC}"

# Exit with non-zero status if any test failed
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ One or more tests failed!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ All executed tests passed!${NC}"
    exit 0
fi 