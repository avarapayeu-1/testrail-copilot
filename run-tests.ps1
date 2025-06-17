# PowerShell script for running Playwright tests in Docker
param (
    [string]$TestType = "all",
    [string]$EnvFile = ".env",
    [string]$ReportDir = "playwright-report",
    [switch]$Debug = $false
)

function Show-Help {
    Write-Host "Playwright Docker Test Runner"
    Write-Host "Usage: .\run-tests.ps1 [-TestType <type>] [-EnvFile <file>] [-ReportDir <dir>] [-Debug]"
    Write-Host ""
    Write-Host "Parameters:"
    Write-Host "  -TestType <type>    Test type to run: api, ui, e2e, or all (default: all)"
    Write-Host "  -EnvFile <file>     Specify .env file location (default: .env)"
    Write-Host "  -ReportDir <dir>    Specify report directory (default: playwright-report)"
    Write-Host "  -Debug              Run tests in debug mode"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\run-tests.ps1 -TestType api                 # Run API tests"
    Write-Host "  .\run-tests.ps1 -TestType ui                  # Run UI tests"
    Write-Host "  .\run-tests.ps1 -TestType e2e -EnvFile .env.staging  # Run E2E tests with staging environment"
    exit 0
}

# Show help if requested
if ($args -contains "-h" -or $args -contains "--help") {
    Show-Help
}

# Check if Docker is running
try {
    $null = & docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker command failed with exit code $LASTEXITCODE"
    }
    Write-Host "Docker is running properly" -ForegroundColor Green
}
catch {
    Write-Host "Error: Docker is not running or not installed." -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Set the log directory
$LogDir = "logs"

# Check if .env file exists
if (Test-Path $EnvFile) {
    $EnvArgs = "--env-file $EnvFile"
    Write-Host "Using environment file: $EnvFile" -ForegroundColor Cyan
}
else {
    $EnvArgs = ""
    Write-Host "Warning: Environment file $EnvFile not found. Using default environment variables." -ForegroundColor Yellow
}

# Set service based on test type
switch ($TestType) {
    "api" { $Service = "api-tests" }
    "ui" { $Service = "ui-tests" }
    "e2e" { $Service = "e2e-tests" }
    "all" { $Service = "all-tests" }
    default {
        Write-Host "Error: Invalid test type '$TestType'. Valid options are: api, ui, e2e, all" -ForegroundColor Red
        exit 1
    }
}

# Add debug flag if needed
if ($Debug) {
    $DebugArgs = "-- --debug"
    Write-Host "Running in debug mode" -ForegroundColor Cyan
}
else {
    $DebugArgs = ""
}

# Ensure directories exist
if (-not (Test-Path $ReportDir)) {
    New-Item -Path $ReportDir -ItemType Directory | Out-Null
    Write-Host "Created directory: $ReportDir" -ForegroundColor Green
}

if (-not (Test-Path "test-results")) {
    New-Item -Path "test-results" -ItemType Directory | Out-Null
    Write-Host "Created directory: test-results" -ForegroundColor Green
}

if (-not (Test-Path $LogDir)) {
    New-Item -Path $LogDir -ItemType Directory | Out-Null
    Write-Host "Created directory: $LogDir" -ForegroundColor Green
}

# Run the tests
Write-Host "Running $TestType tests with Docker..." -ForegroundColor Cyan

# Use Docker Compose's native volume mapping instead of manual volume mapping
$Command = "docker-compose $EnvArgs run $Service $DebugArgs"
Write-Host "Executing: $Command" -ForegroundColor DarkGray

# Execute the command
Invoke-Expression $Command
$ExitCode = $LASTEXITCODE

Write-Host "Tests completed with exit code: $ExitCode" -ForegroundColor $(if ($ExitCode -eq 0) { "Green" } else { "Red" })
Write-Host "Test report available at: $ReportDir" -ForegroundColor Cyan

exit $ExitCode
