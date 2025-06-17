@echo off
REM Helper script for running Playwright tests in Docker on Windows

REM Parse command line arguments
set ENV_FILE=.env
set REPORT_DIR=playwright-report
set TEST_TYPE=all
set DEBUG_MODE=false
set LOG_DIR=logs

:parse_args
if "%~1"=="" goto run_tests

if "%~1"=="-h" (
    goto show_help
) else if "%~1"=="--help" (
    goto show_help
) else if "%~1"=="-e" (
    set ENV_FILE=%~2
    shift
    shift
    goto parse_args
) else if "%~1"=="--env" (
    set ENV_FILE=%~2
    shift
    shift
    goto parse_args
) else if "%~1"=="-r" (
    set REPORT_DIR=%~2
    shift
    shift
    goto parse_args
) else if "%~1"=="--report" (
    set REPORT_DIR=%~2
    shift
    shift
    goto parse_args
) else if "%~1"=="-d" (
    set DEBUG_MODE=true
    shift
    goto parse_args
) else if "%~1"=="--debug" (
    set DEBUG_MODE=true
    shift
    goto parse_args
) else if "%~1"=="api" (
    set TEST_TYPE=api
    shift
    goto parse_args
) else if "%~1"=="ui" (
    set TEST_TYPE=ui
    shift
    goto parse_args
) else if "%~1"=="e2e" (
    set TEST_TYPE=e2e
    shift
    goto parse_args
) else if "%~1"=="all" (
    set TEST_TYPE=all
    shift
    goto parse_args
) else (
    echo Unknown option: %~1
    goto show_help
)

:show_help
echo Playwright Docker Test Runner
echo Usage: run-tests.bat [options] [test-type]
echo.
echo Options:
echo   -h, --help          Show this help message
echo   -e, --env FILE      Specify .env file location (default: .env)
echo   -r, --report DIR    Specify report directory (default: playwright-report)
echo   -d, --debug         Run tests in debug mode
echo.
echo Test Types:
echo   api                 Run API tests only
echo   ui                  Run UI tests only
echo   e2e                 Run E2E tests (UI + integration)
echo   all                 Run all tests (default)
echo.
echo Example:
echo   run-tests.bat api  # Run API tests
echo   run-tests.bat ui   # Run UI tests
echo   run-tests.bat -e .env.staging e2e  # Run E2E tests with staging environment variables
exit /b 0

:run_tests
REM Check if Docker is running
docker info > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Docker is not running or not installed.
    exit /b 1
)

REM Check if .env file exists
if exist "%ENV_FILE%" (
    set ENV_ARGS=--env-file %ENV_FILE%
    echo Using environment file: %ENV_FILE%
) else (
    set ENV_ARGS=
    echo Warning: Environment file %ENV_FILE% not found. Using default environment variables.
)

REM Set up command based on test type
if "%TEST_TYPE%"=="api" (
    set SERVICE=api-tests
) else if "%TEST_TYPE%"=="ui" (
    set SERVICE=ui-tests
) else if "%TEST_TYPE%"=="e2e" (
    set SERVICE=e2e-tests
) else if "%TEST_TYPE%"=="all" (
    set SERVICE=all-tests
)

REM Add debug flag if needed
if "%DEBUG_MODE%"=="true" (
    set DEBUG_ARGS=-- --debug
) else (
    set DEBUG_ARGS=
)

REM Run the tests
echo Running %TEST_TYPE% tests with Docker...
docker-compose %ENV_ARGS% run -v "%CD%\%REPORT_DIR%:/app/playwright-report" -v "%CD%\test-results:/app/test-results" -v "%CD%\%LOG_DIR%:/app/logs" %SERVICE% %DEBUG_ARGS%

set EXIT_CODE=%ERRORLEVEL%

echo Tests completed with exit code: %EXIT_CODE%
echo Test report available at: %REPORT_DIR%

exit /b %EXIT_CODE%
