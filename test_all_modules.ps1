# PowerShell script to run all test modules in sequence

# Define colors for output
$GREEN = "Green"
$RED = "Red"
$YELLOW = "Yellow"
$CYAN = "Cyan"

# Initialize results hashtable
$TEST_RESULTS = @{}

# Function to run a test script and track its result
function Run-Test {
    param (
        [string]$TestName,
        [string]$TestScript
    )
    
    Write-Host "`n=======================================================" -ForegroundColor $YELLOW
    Write-Host "Running test: $TestName" -ForegroundColor $YELLOW
    Write-Host "=======================================================" -ForegroundColor $YELLOW
    
    # Check if script exists
    if (-not (Test-Path $TestScript)) {
        Write-Host "Test script not found: $TestScript" -ForegroundColor $RED
        $TEST_RESULTS[$TestName] = "SKIPPED (not found)"
        return
    }
    
    # Run the test script
    try {
        if ($TestScript.EndsWith(".ps1")) {
            # PowerShell script
            & $TestScript
        } else {
            # Bash script - attempt to run with bash if available
            if (Get-Command "bash" -ErrorAction SilentlyContinue) {
                bash $TestScript
            } else {
                Write-Host "Bash not found. Please install Git Bash or WSL to run .sh scripts." -ForegroundColor $RED
                $TEST_RESULTS[$TestName] = "SKIPPED (bash not available)"
                return
            }
        }
        
        if ($LASTEXITCODE -eq 0 -or $null -eq $LASTEXITCODE) {
            Write-Host "`n✅ Test '$TestName' completed successfully!" -ForegroundColor $GREEN
            $TEST_RESULTS[$TestName] = "PASSED"
        } else {
            Write-Host "`n❌ Test '$TestName' failed!" -ForegroundColor $RED
            $TEST_RESULTS[$TestName] = "FAILED"
        }
    } catch {
        Write-Host "`n❌ Test '$TestName' failed with error: $_" -ForegroundColor $RED
        $TEST_RESULTS[$TestName] = "FAILED"
    }
}

# Load environment variables if available
if (Test-Path "./load_env.ps1") {
    Write-Host "Loading environment variables..."
    . ./load_env.ps1
} else {
    Write-Host "load_env.ps1 not found. Continuing without loading environment." -ForegroundColor $YELLOW
    
    # Check for AWS credentials
    if ([string]::IsNullOrEmpty($env:AWS_ACCESS_KEY_ID) -or [string]::IsNullOrEmpty($env:AWS_SECRET_ACCESS_KEY)) {
        Write-Host "Warning: AWS credentials not found in environment." -ForegroundColor $YELLOW
        Write-Host "Some tests may fail or prompt for credentials."
    }
    
    # Check for PostgreSQL password
    if ([string]::IsNullOrEmpty($env:PGPASSWORD)) {
        Write-Host "Warning: PGPASSWORD not found in environment." -ForegroundColor $YELLOW
        Write-Host "Some tests may fail or prompt for password."
    }
}

# Run all test modules
Write-Host "`nStarting test suite execution..." -ForegroundColor $YELLOW

# Determine which scripts to run (PowerShell or Bash)
$hasBash = $null -ne (Get-Command "bash" -ErrorAction SilentlyContinue)

# 1. S3 Backup Test
if (Test-Path "./tests/test_s3_backup.ps1") {
    Run-Test "S3 Backup Integration" "./tests/test_s3_backup.ps1"
} elseif ($hasBash -and (Test-Path "./tests/test_s3_backup.sh")) {
    Run-Test "S3 Backup Integration" "./tests/test_s3_backup.sh"
} else {
    Write-Host "S3 Backup test script not found" -ForegroundColor $YELLOW
    $TEST_RESULTS["S3 Backup Integration"] = "SKIPPED (not found)"
}

# 2. Standby Cluster Test
if (Test-Path "./test_standby_cluster.ps1") {
    Run-Test "Standby Cluster" "./test_standby_cluster.ps1"
} elseif ($hasBash -and (Test-Path "./test_standby_cluster.sh")) {
    Run-Test "Standby Cluster" "./test_standby_cluster.sh"
} else {
    Write-Host "Standby Cluster test script not found" -ForegroundColor $YELLOW
    $TEST_RESULTS["Standby Cluster"] = "SKIPPED (not found)"
}

# Add more tests here as they become available
# if (Test-Path "./tests/test_cloudflare.ps1") { ... }

# Print summary of all test results
Write-Host "`n=======================================================" -ForegroundColor $YELLOW
Write-Host "Test Suite Summary" -ForegroundColor $YELLOW
Write-Host "=======================================================" -ForegroundColor $YELLOW

$PASSED = 0
$FAILED = 0
$SKIPPED = 0

foreach ($testName in $TEST_RESULTS.Keys) {
    $result = $TEST_RESULTS[$testName]
    
    if ($result -eq "PASSED") {
        Write-Host "✅ $testName: $result" -ForegroundColor $GREEN
        $PASSED++
    } elseif ($result -eq "FAILED") {
        Write-Host "❌ $testName: $result" -ForegroundColor $RED
        $FAILED++
    } else {
        Write-Host "⚠️ $testName: $result" -ForegroundColor $YELLOW
        $SKIPPED++
    }
}

Write-Host "`nTests summary: $PASSED passed, $FAILED failed, $SKIPPED skipped" -ForegroundColor $YELLOW

# Exit with non-zero status if any test failed
if ($FAILED -gt 0) {
    Write-Host "❌ One or more tests failed!" -ForegroundColor $RED
    exit 1
} else {
    Write-Host "✅ All executed tests passed!" -ForegroundColor $GREEN
    exit 0
} 