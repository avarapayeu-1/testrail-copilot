# Docker Setup for TestRail Playwright Tests

This document explains how to run the TestRail Playwright tests in Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone the repository
2. Ensure your `.env` file is set up with all required credentials
3. Run tests using one of the provided scripts

## Running Tests

### Using PowerShell (Recommended for Windows)

```powershell
# Run API tests
.\run-tests.ps1 -TestType api

# Run UI tests
.\run-tests.ps1 -TestType ui

# Run E2E tests (UI + integration)
.\run-tests.ps1 -TestType e2e

# Run all tests
.\run-tests.ps1 -TestType all

# Run tests with debug mode
.\run-tests.ps1 -TestType ui -Debug

# Use a custom environment file
.\run-tests.ps1 -TestType api -EnvFile .env.staging
```

### Using Batch Script (Windows)

```cmd
# Run API tests
run-tests.bat api

# Run UI tests
run-tests.bat ui

# Run E2E tests
run-tests.bat e2e

# Run all tests
run-tests.bat all

# Run with debug mode
run-tests.bat -d api

# Use a custom environment file
run-tests.bat -e .env.staging api
```

### Using Shell Script (Linux/macOS)

```bash
# Make the script executable
chmod +x run-tests.sh

# Run API tests
./run-tests.sh api

# Run UI tests
./run-tests.sh ui

# Run E2E tests
./run-tests.sh e2e

# Run all tests
./run-tests.sh all

# Run with debug mode
./run-tests.sh -d api

# Use a custom environment file
./run-tests.sh -e .env.staging api
```

### Using Docker Compose Directly

```bash
# Run API tests
docker-compose run api-tests

# Run UI tests
docker-compose run ui-tests

# Run E2E tests
docker-compose run e2e-tests

# Run all tests
docker-compose run all-tests
```

## Environment Variables

All environment variables can be configured in the `.env` file. The key variables are:

| Variable | Description | Required |
|----------|-------------|----------|
| BASE_URL | TestRail instance URL | Yes |
| API_URL | TestRail API URL | Yes |
| USER_EMAIL | TestRail user email | Yes |
| USER_PASSWORD | TestRail user password | Yes |
| TESTRAIL_EMAIL | TestRail API email | Yes |
| TESTRAIL_API_KEY | TestRail API key | Yes |
| TESTRAIL_PASSWORD | TestRail password | Yes |
| HEADLESS | Run browsers in headless mode | No (default: true) |
| BROWSER | Browser to use (chromium, firefox, webkit) | No (default: chromium) |
| TIMEOUT | Timeout in milliseconds | No (default: 60000) |
| RETRY_COUNT | Number of retries for failed tests | No (default: 2) |
| CI | Set to true in CI environments | No (default: false) |

## Test Results

After running tests, you can find:

- Test reports in the `playwright-report` directory
- Test results in the `test-results` directory
- Logs in the `logs` directory

## Debugging

For debugging test failures:

1. Run tests with the debug flag: `-Debug` (PowerShell) or `-d` (Batch/Shell)
2. Check the test results directory for screenshots and traces
3. Review the logs in the `logs` directory

## Continuous Integration

This project includes GitHub Actions workflows for CI/CD. See the `.github/workflows` directory for details.

## Troubleshooting

### Common Issues

1. **Error: Docker is not running**
   - Ensure Docker Desktop is running on your machine

2. **Error: docker-compose command not found**
   - Ensure Docker Compose is properly installed

3. **Permission denied when running shell script**
   - Run `chmod +x run-tests.sh` to make the script executable

4. **Tests fail in Docker but pass locally**
   - Check environment variables and browser configuration
   - Ensure proper volume mounting for test artifacts
