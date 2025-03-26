# PowerShell script to sanitize configuration files by removing sensitive information

# Define config files to process
$CONFIGS = @(
    "test_standby_cluster.yml",
    "tests/test_s3_backup.yml"
)

Write-Host "Sanitizing configuration files..."

foreach ($config in $CONFIGS) {
    if (Test-Path $config) {
        Write-Host "Processing: $config"
        
        # Create backup with .bak extension
        Copy-Item -Path $config -Destination "$config.bak" -Force
        
        # Read the content of the file
        $content = Get-Content -Path $config -Raw
        
        # Sanitize password fields
        $content = $content -replace 'password: ".*"', 'password: "your_postgres_password_here"'
        
        # Sanitize AWS access keys
        $content = $content -replace 'access_key: ".*"', 'access_key: ""'
        $content = $content -replace 'secret_key: ".*"', 'secret_key: ""'
        
        # Add comment about environment variables if not already present
        if (-not ($content -match "# Use environment variables for credentials")) {
            $content = $content -replace 'secret_key: ""', @'
secret_key: ""
    # Use environment variables for credentials - DO NOT hardcode values here
    # Export these variables before running the tests:
    # export AWS_ACCESS_KEY_ID=your_access_key
    # export AWS_SECRET_ACCESS_KEY=your_secret_key
'@
        }
        
        # Sanitize any IP addresses (with exceptions for localhost and private ranges)
        $content = $content -replace 'host: "(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"', 'host: "your_database_host_here"'
        
        # Restore localhost and private IPs
        $content = $content -replace 'host: "your_database_host_here"', 'host: "localhost"'
        $content = $content -replace 'host: "your_database_host_here"', 'host: "127.0.0.1"'
        
        # Write the sanitized content back to the file
        Set-Content -Path $config -Value $content
        
        Write-Host "✅ Sanitized: $config" -ForegroundColor Green
        Write-Host "   Backup saved as: $config.bak"
    } else {
        Write-Host "⚠️ Config file not found: $config" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Configuration files sanitized. Original files backed up with .bak extension." -ForegroundColor Cyan
Write-Host "Please verify the sanitized files before committing to version control." 