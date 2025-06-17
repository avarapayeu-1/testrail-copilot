# Performance Testing with k6

This directory contains performance tests using [Grafana k6](https://k6.io/), a modern load testing tool.

## Getting Started

### Setup Environment

1. Create an `env.json` file based on the provided example:
   ```bash
   cp env.json.example env.json
   ```
   
2. Edit `env.json` with your TestRail credentials and API details

### Run Tests

To run performance tests:

```bash
# Run the simple test
npm run test:perf

# Run the TestRail Project API test
npm run test:perf:project
# Or use the batch file
run-projects-load-test.bat

# Run the TestRail Test Cases API test 
npm run test:perf:testcases
# Or use the batch file
run-testcases-load-test.bat
```

### Using Environment Variables

You can pass environment variables in two ways:

#### 1. Using env.json with our helper script

```bash
# For project API test
npm run test:perf:project:env

# For test cases API test
npm run test:perf:testcases:env
```

This approach uses a Node.js script to load variables from env.json and pass them to k6.

#### 2. Passing variables directly on the command line

```bash
k6 run -e API_URL=https://your-testrail.com/index.php?/api/v2/ -e EMAIL=your@email.com -e API_KEY=your-key tests/performance/project-api.test.ts
```

## Test Files

- `simple-test.ts` - A basic test that demonstrates how to use k6 for performance testing
- `project-api.test.ts` - Performance test for the TestRail Project API's getProject endpoint

## Writing Tests

k6 tests are written in TypeScript/JavaScript and use the k6 API. Here's a basic structure:

```typescript
import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  vus: 10,                // Virtual Users
  duration: '30s',        // Test duration
  thresholds: {
    http_req_duration: ['p(95) < 500'], // 95% of requests must finish within 500ms
  },
};

// Default function
export default function() {
  // Test logic here
  const res = http.get('https://your-api-endpoint.com');
  
  // Assertions
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  sleep(1); // Wait between requests
}
```

## Available Metrics

k6 automatically collects several metrics:

- **http_req_duration**: Total time for the request
- **http_req_failed**: Rate of failed requests
- **iterations**: Number of times the script was executed
- **vus**: Number of virtual users

## Custom Metrics

You can create custom metrics using the `Trend`, `Counter`, `Gauge`, and `Rate` objects.

```typescript
import { Trend } from 'k6/metrics';

const myTrend = new Trend('my_trend');

export default function() {
  // ... test logic
  myTrend.add(value);
}
```

For more information, see the [k6 documentation](https://grafana.com/docs/k6/latest/).
