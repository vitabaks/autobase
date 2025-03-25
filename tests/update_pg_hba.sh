#!/bin/bash
# Script to update pg_hba.conf to allow remote connections

set -e

# Get the PostgreSQL host from the test configuration
CONFIG_FILE="test_standby_cluster.yml"
PRIMARY_HOST=$(grep -A2 "primary_cluster:" $CONFIG_FILE | grep "host:" | awk -F'"' '{print $2}')

echo "This script will update pg_hba.conf on the PostgreSQL server at $PRIMARY_HOST"
echo "to allow remote connections for testing."
echo ""
echo "Please enter the SSH username for $PRIMARY_HOST:"
read SSH_USER

echo "Please enter the path to the SSH private key (press Enter for default ~/.ssh/id_rsa):"
read SSH_KEY_PATH
SSH_KEY_PATH=${SSH_KEY_PATH:-~/.ssh/id_rsa}

# Get the client's public IP address
CLIENT_IP=$(curl -s ifconfig.me)
echo "Your public IP address is: $CLIENT_IP"

# Generate pg_hba.conf entry
PG_HBA_ENTRY="host    all             postgres             $CLIENT_IP/32            scram-sha-256"

echo "Will add the following entry to pg_hba.conf:"
echo "$PG_HBA_ENTRY"
echo ""

echo "Connecting to PostgreSQL server..."
# SSH to the server and update pg_hba.conf
ssh -i "$SSH_KEY_PATH" "$SSH_USER@$PRIMARY_HOST" << EOF
  # Find the pg_hba.conf file
  PG_HBA_PATH=\$(sudo -u postgres psql -t -c "SHOW hba_file;" | xargs)
  echo "Found pg_hba.conf at \$PG_HBA_PATH"
  
  # Check if entry already exists
  if sudo grep -q "$CLIENT_IP/32" "\$PG_HBA_PATH"; then
    echo "Entry for $CLIENT_IP already exists in pg_hba.conf"
  else
    # Add the new entry
    echo "Adding new entry to pg_hba.conf"
    echo "$PG_HBA_ENTRY" | sudo tee -a "\$PG_HBA_PATH"
    
    # Reload PostgreSQL configuration
    if command -v systemctl &> /dev/null; then
      sudo systemctl reload postgresql
    elif command -v pg_ctl &> /dev/null; then
      PG_VERSION=\$(sudo -u postgres psql -t -c "SHOW server_version;" | xargs | cut -d. -f1)
      sudo -u postgres pg_ctl -D /var/lib/postgresql/\$PG_VERSION/main reload
    else
      # If using Patroni
      sudo systemctl reload patroni
    fi
    
    echo "PostgreSQL configuration reloaded"
  fi
EOF

echo "pg_hba.conf update completed. You should now be able to connect remotely."
echo "Run the test_standby_cluster.sh script again to test the connection." 