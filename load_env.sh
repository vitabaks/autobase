#!/bin/bash
# Script to help load environment variables for testing

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found!"
  echo "Please copy .env.example to .env and fill in your values:"
  echo "  cp .env.example .env"
  echo "  nano .env  # Edit with your credentials"
  exit 1
fi

# Source the .env file
source .env

# Verify essential variables are set
missing_vars=0

# Check AWS credentials
if [ -z "$AWS_ACCESS_KEY_ID" ]; then
  echo "WARNING: AWS_ACCESS_KEY_ID is not set"
  missing_vars=1
fi

if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "WARNING: AWS_SECRET_ACCESS_KEY is not set"
  missing_vars=1
fi

if [ -z "$AWS_DEFAULT_REGION" ]; then
  echo "WARNING: AWS_DEFAULT_REGION is not set"
  missing_vars=1
fi

# Check PostgreSQL password
if [ -z "$PGPASSWORD" ]; then
  echo "WARNING: PGPASSWORD is not set"
  missing_vars=1
fi

if [ $missing_vars -eq 1 ]; then
  echo "Some environment variables are missing. Please update your .env file."
  echo "For now, the tests will prompt for missing values when needed."
else
  echo "All essential environment variables are loaded successfully."
fi

# Print guidance
echo ""
echo "Environment loaded. You can now run test scripts, for example:"
echo "  ./test_standby_cluster.sh"
echo "  ./test_s3_backup.sh"
echo "  ./test_all_modules.sh" 