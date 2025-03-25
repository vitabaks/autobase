#!/bin/bash
# Test script for Cloudflare DNS and load balancing integration

set -e

# Load test configuration
CONFIG_FILE="test_cloudflare.yml"
API_TOKEN=$(grep -A2 "api_token:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
ZONE_ID=$(grep -A2 "zone_id:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
ACCOUNT_ID=$(grep -A2 "account_id:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
DOMAIN=$(grep -A2 "domain:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
PRIMARY_RECORD=$(grep -A2 "primary_record:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
REPLICA_RECORD=$(grep -A2 "replica_record:" $CONFIG_FILE | head -1 | awk -F'"' '{print $2}')
PRIMARY_IP=$(grep -A2 "primary_node:" $CONFIG_FILE | grep "ip:" | awk -F'"' '{print $2}')

echo "==== Testing Cloudflare Integration ===="
echo "Domain: $DOMAIN"
echo "Primary record: $PRIMARY_RECORD.$DOMAIN"
echo "Replica record pattern: $REPLICA_RECORD-*.$DOMAIN"

# Function to make Cloudflare API requests
cf_api_request() {
    local endpoint="$1"
    local method="${2:-GET}"
    local data="$3"
    
    if [ -z "$data" ]; then
        curl -s -X "$method" \
            "https://api.cloudflare.com/client/v4$endpoint" \
            -H "Authorization: Bearer $API_TOKEN" \
            -H "Content-Type: application/json"
    else
        curl -s -X "$method" \
            "https://api.cloudflare.com/client/v4$endpoint" \
            -H "Authorization: Bearer $API_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data"
    fi
}

echo "==== 1. Testing DNS Record Creation ===="

# Check if primary DNS record exists
echo "Checking primary DNS record ($PRIMARY_RECORD.$DOMAIN)..."
primary_dns_check=$(cf_api_request "/zones/$ZONE_ID/dns_records?name=$PRIMARY_RECORD.$DOMAIN")
primary_exists=$(echo "$primary_dns_check" | jq -r '.result | length')

if [ "$primary_exists" -gt 0 ]; then
    echo "✅ Primary DNS record exists!"
    primary_record_id=$(echo "$primary_dns_check" | jq -r '.result[0].id')
else
    echo "❌ Primary DNS record not found!"
    
    # Create primary DNS record
    echo "Creating primary DNS record..."
    primary_dns_data='{
        "type": "A",
        "name": "'$PRIMARY_RECORD'",
        "content": "'$PRIMARY_IP'",
        "ttl": 120,
        "proxied": true
    }'
    
    primary_dns_create=$(cf_api_request "/zones/$ZONE_ID/dns_records" "POST" "$primary_dns_data")
    primary_created=$(echo "$primary_dns_create" | jq -r '.success')
    
    if [ "$primary_created" = "true" ]; then
        echo "✅ Primary DNS record created successfully!"
        primary_record_id=$(echo "$primary_dns_create" | jq -r '.result.id')
    else
        echo "❌ Failed to create primary DNS record!"
        echo "$primary_dns_create" | jq '.'
        exit 1
    fi
fi

echo "==== 2. Testing Load Balancer Configuration ===="

# Check if load balancer exists
echo "Checking load balancer configuration..."
lb_check=$(cf_api_request "/zones/$ZONE_ID/load_balancers")
lb_exists=$(echo "$lb_check" | jq -r '.result | length')

if [ "$lb_exists" -gt 0 ]; then
    echo "✅ Load balancer configuration exists!"
else
    echo "Load balancer not configured."
    
    # Test creating a load balancer pool for primary
    echo "Creating primary load balancer pool..."
    primary_pool_data='{
        "name": "primary-pool",
        "description": "Primary PostgreSQL servers",
        "enabled": true,
        "monitor": null,
        "origins": [
            {
                "name": "primary",
                "address": "'$PRIMARY_IP'",
                "enabled": true,
                "weight": 1
            }
        ]
    }'
    
    primary_pool_create=$(cf_api_request "/accounts/$ACCOUNT_ID/load_balancers/pools" "POST" "$primary_pool_data")
    primary_pool_created=$(echo "$primary_pool_create" | jq -r '.success')
    
    if [ "$primary_pool_created" = "true" ]; then
        echo "✅ Primary load balancer pool created successfully!"
    else
        echo "❌ Failed to create primary load balancer pool!"
        echo "$primary_pool_create" | jq '.'
    fi
fi

echo "==== 3. Testing DNS Resolution ===="

# Test DNS resolution
echo "Testing DNS resolution for $PRIMARY_RECORD.$DOMAIN..."
primary_dns_lookup=$(dig +short $PRIMARY_RECORD.$DOMAIN)

if [ -n "$primary_dns_lookup" ]; then
    echo "✅ DNS resolution successful! Resolved to: $primary_dns_lookup"
    
    # Compare with expected IP
    if [ "$primary_dns_lookup" = "$PRIMARY_IP" ]; then
        echo "✅ DNS resolves to the correct IP!"
    else
        echo "⚠️ DNS resolves to $primary_dns_lookup, but expected $PRIMARY_IP"
    fi
else
    echo "❌ DNS resolution failed for $PRIMARY_RECORD.$DOMAIN"
fi

echo "==== All tests completed! ====" 