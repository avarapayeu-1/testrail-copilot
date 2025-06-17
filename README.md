# TestRail Automation Framework

A comprehensive test automation framework for TestRail built with Playwright and TypeScript.

## Features

- Page Object Model pattern for TestRail's UI components
- TestRail API integration for backend testing
- Flexible configuration for multiple environments
- Data-driven testing capabilities
- Cross-browser testing (Chromium, Firefox, WebKit)
- Parallel test execution
- CI/CD integration with GitHub Actions
- Retry mechanisms for flaky tests

## TestRail Features Covered

### UI Tests
- Login and authentication
- Dashboard navigation
- Project management
- Test case creation and management
- Test run execution
- Milestone tracking
- Reporting functionality

### API Tests
- Project management (CRUD operations)
- Test case management
- Test run execution
- Results reporting

## CI/CD Integration

This project includes GitHub Actions workflow for continuous integration and scheduled test runs:

### Workflow Features
- Automatic test execution on push/pull request to main branch
- Weekly scheduled test runs
- Separate jobs for API and UI tests
- Test artifacts storage for debugging
- Environment variable management using GitHub Secrets

### GitHub Secrets Required
To run the CI/CD workflow, you need to configure the following secrets in your GitHub repository:

- `TESTRAIL_BASE_URL`: URL of your TestRail instance
- `TESTRAIL_EMAIL`: TestRail user email
- `TESTRAIL_PASSWORD`: TestRail user password  
- `TESTRAIL_API_KEY`: TestRail API key/password

### Workflow Status
[![TestRail Playwright Tests](https://github.com/yourusername/testrail-copilot/actions/workflows/playwright.yml/badge.svg)](https://github.com/yourusername/testrail-copilot/actions/workflows/playwright.yml)

## Project Structure

```
├── src/
│   ├── data/        # Test data generators and data files
│   ├── helpers/     # TestRail API helpers and utilities
│   ├── pages/       # Page Objects for TestRail UI
│   └── utils/       # Configuration and utility functions
├── tests/
│   ├── api/         # TestRail API tests
│   ├── integration/ # Integration tests
│   └── ui/          # TestRail UI tests
└── playwright.config.ts  # Playwright configuration
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Copy the `.env.example` file to `.env` and adjust the values with your TestRail credentials:

```properties
# Environment
TEST_ENV=dev

# TestRail URLs
BASE_URL=https://your-instance.testrail.io/
API_URL=https://your-instance.testrail.io/

# TestRail Credentials
USER_EMAIL=your.email@example.com
USER_PASSWORD=your-password
```

## Running Tests

Run all TestRail tests:

```bash
npm test
```

Run with UI mode for debugging:

```bash
npm run test:ui
```

Run tests in specific browsers:

```bash
npm run test:chrome
```

Run API tests only:

```bash
npm run test:api
```

Run UI and integration tests:

```bash
npm run test:e2e
```

Debug tests:

```bash
npm run test:debug
```

## Test Reports

View HTML report:

```bash
npm run report
```

The report includes:
- Test results by feature area
- Screenshots of failures
- Test execution timeline
- Detailed logs

## Development

Format code:

```bash
npm run format
```

Generate tests with Codegen (useful for mapping new TestRail UI elements):

```bash
npm run codegen
```

## Adding New Tests

### UI Tests

1. Create page objects for the TestRail feature under `src/pages/`
2. Add test cases under `tests/ui/` focusing on specific features
3. Use the existing page objects and test patterns

### API Tests

1. Add new API methods in the `src/helpers/TestRailApi.ts` file if needed
2. Create test cases under `tests/api/` for specific endpoints
3. Follow the existing patterns for authentication and error handling

## CI/CD Integration

This framework is designed to be integrated with CI/CD pipelines such as GitHub Actions, Jenkins, or Azure DevOps. Configure your pipeline to:

1. Install dependencies
2. Run tests against your TestRail instance
3. Generate and publish test reports

The project is configured to work with CI/CD systems. Use the environment variable `CI=true` to adjust behavior in CI environments.

## Docker Integration

This project includes Docker setup for running tests in isolated containers, ensuring consistent test execution across different environments.

### Requirements

- Docker and Docker Compose installed on your machine
- No need to install Node.js, Playwright, or browsers locally

### Building the Docker Image

```bash
docker build -t testrail-playwright-tests .
```

### Running Tests with Docker

#### Using Docker Compose (Recommended)

Run API tests:
```bash
docker-compose run api-tests
```

Run UI tests:
```bash
docker-compose run ui-tests
```

Run E2E tests (UI + integration):
```bash
docker-compose run e2e-tests
```

Run all tests:
```bash
docker-compose run all-tests
```

#### Using Docker Directly

Run API tests:
```bash
docker run -v $(pwd)/playwright-report:/app/playwright-report -v $(pwd)/test-results:/app/test-results testrail-playwright-tests npm run test:api
```

Run UI tests:
```bash
docker run -v $(pwd)/playwright-report:/app/playwright-report -v $(pwd)/test-results:/app/test-results testrail-playwright-tests npm run test:ui
```

### Environment Variables

The Docker setup is configured to automatically load variables from your `.env` file. You can also override specific variables when running the container:

```bash
docker-compose run -e BASE_URL=https://your-custom-testrail-instance.com -e TESTRAIL_API_KEY=custom_api_key ui-tests
```

The following environment variables are used in the Docker setup:

```
# Required variables (already in your .env file)
BASE_URL             # URL of your TestRail instance
API_URL              # TestRail API URL
USER_EMAIL           # TestRail user email
USER_PASSWORD        # TestRail user password
TESTRAIL_EMAIL       # TestRail API email
TESTRAIL_PASSWORD    # TestRail user password
TESTRAIL_API_KEY     # TestRail API key

# Optional variables (with defaults)
TEST_ENV=dev         # Environment (dev, staging, prod)
HEADLESS=true        # Run browsers in headless mode
BROWSER=chromium     # Browser to use for tests
TIMEOUT=60000        # Timeout in milliseconds
RETRY_COUNT=2        # Number of retries for failed tests
CI=false             # Set to true in CI environments
```

### Test Reports

Test reports will be available in the `playwright-report` directory on your host machine thanks to the volume mapping in Docker Compose.
