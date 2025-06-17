#!/bin/bash
# Helper script for running Playwright tests in Docker

# Function to display help menu
show_help() {
    echo "Playwright Docker Test Runner"
    echo "Usage: ./run-tests.sh [options] [test-type]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -e, --env FILE      Specify .env file location (default: .env)"
    echo "  -r, --report DIR    Specify report directory (default: playwright-report)"
    echo "  -d, --debug         Run tests in debug mode"
    echo ""
    echo "Test Types:"
    echo "  api                 Run API tests only"
    echo "  ui                  Run UI tests only"
    echo "  e2e                 Run E2E tests (UI + integration)"
    echo "  all                 Run all tests (default)"
    echo ""
    echo "Example:"
    echo "  ./run-tests.sh api  # Run API tests"
    echo "  ./run-tests.sh ui   # Run UI tests"
    echo "  ./run-tests.sh -e .env.staging e2e  # Run E2E tests with staging environment variables"
}

# Default values
ENV_FILE=.env
REPORT_DIR=playwright-report
TEST_TYPE=all
DEBUG_MODE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -e|--env)
            ENV_FILE="$2"
            shift 2
            ;;
        -r|--report)
            REPORT_DIR="$2"
            shift 2
            ;;
        -d|--debug)
            DEBUG_MODE=true
            shift
            ;;
        api|ui|e2e|all)
            TEST_TYPE="$1"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running or not installed."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose > /dev/null; then
    echo "Error: docker-compose is not installed."
    exit 1
fi

# Check if .env file exists
if [ -f "$ENV_FILE" ]; then
    ENV_ARGS="--env-file $ENV_FILE"
    echo "Using environment file: $ENV_FILE"
else
    ENV_ARGS=""
    echo "Warning: Environment file $ENV_FILE not found. Using default environment variables."
fi

# Set up command based on test type
case $TEST_TYPE in
    api)
        SERVICE="api-tests"
        ;;
    ui)
        SERVICE="ui-tests"
        ;;
    e2e)
        SERVICE="e2e-tests"
        ;;
    all)
        SERVICE="all-tests"
        ;;
esac

# Add debug flag if needed
DEBUG_ARGS=""
if [ "$DEBUG_MODE" = true ]; then
    DEBUG_ARGS="-- --debug"
fi

# Run the tests
echo "Running $TEST_TYPE tests with Docker..."
docker-compose $ENV_ARGS run \
    -v "$(pwd)/$REPORT_DIR:/app/playwright-report" \
    -v "$(pwd)/test-results:/app/test-results" \
    $SERVICE $DEBUG_ARGS

exit_code=$?

echo "Tests completed with exit code: $exit_code"
echo "Test report available at: $REPORT_DIR"

exit $exit_code

# Note: When running on Unix systems, make sure to set executable permissions:
# chmod +x ./run-tests.sh
