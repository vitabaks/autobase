# PowerShell script to help load environment variables for testing

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Error "Error: .env file not found!"
    Write-Host "Please copy .env.example to .env and fill in your values:"
    Write-Host "  copy .env.example .env"
    Write-Host "  notepad .env  # Edit with your credentials"
    exit 1
}

# Read and parse the .env file
$envContent = Get-Content .env
$missingVars = 0

# Process each line in the .env file
foreach ($line in $envContent) {
    # Skip comments and empty lines
    if ($line.Trim().StartsWith("#") -or [string]::IsNullOrWhiteSpace($line)) {
        continue
    }
    
    # Process export lines (convert from bash to PowerShell)
    if ($line.Trim().StartsWith("export ")) {
        $line = $line.Trim().Substring(7)  # Remove "export " prefix
    }
    
    # Split the line into key and value
    $parts = $line.Split("=", 2)
    if ($parts.Length -eq 2) {
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        
        # Remove quotes if present
        if ($value.StartsWith('"') -and $value.EndsWith('"')) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        
        # Set the environment variable
        [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
    }
}

# Verify essential variables are set
# Check AWS credentials
if ([string]::IsNullOrEmpty($env:AWS_ACCESS_KEY_ID)) {
    Write-Host "WARNING: AWS_ACCESS_KEY_ID is not set" -ForegroundColor Yellow
    $missingVars = 1
}

if ([string]::IsNullOrEmpty($env:AWS_SECRET_ACCESS_KEY)) {
    Write-Host "WARNING: AWS_SECRET_ACCESS_KEY is not set" -ForegroundColor Yellow
    $missingVars = 1
}

if ([string]::IsNullOrEmpty($env:AWS_DEFAULT_REGION)) {
    Write-Host "WARNING: AWS_DEFAULT_REGION is not set" -ForegroundColor Yellow
    $missingVars = 1
}

# Check PostgreSQL password
if ([string]::IsNullOrEmpty($env:PGPASSWORD)) {
    Write-Host "WARNING: PGPASSWORD is not set" -ForegroundColor Yellow
    $missingVars = 1
}

if ($missingVars -eq 1) {
    Write-Host "Some environment variables are missing. Please update your .env file." -ForegroundColor Yellow
    Write-Host "For now, the tests will prompt for missing values when needed."
} else {
    Write-Host "All essential environment variables are loaded successfully." -ForegroundColor Green
}

# Print guidance
Write-Host ""
Write-Host "Environment loaded. You can now run test scripts, for example:" -ForegroundColor Cyan
Write-Host "  .\test_standby_cluster.ps1"
Write-Host "  .\tests\test_s3_backup.ps1"
Write-Host "  .\test_all_modules.ps1" 