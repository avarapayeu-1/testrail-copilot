import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
import encoding from 'k6/encoding';

// TypeScript will show errors in your editor but k6 can still run the test properly

// Custom metrics
const testCaseApiCalls = new Counter('test_case_api_calls');

// Environment variables - read from k6 environment
const API_URL = __ENV.API_URL || 'https://your-testrail-instance.com/index.php?/api/v2/';
const EMAIL = __ENV.EMAIL || 'your-email@example.com';
const API_KEY = __ENV.API_KEY || 'your-api-key';

// Project and suite IDs for the test
const PROJECT_ID = Number(__ENV.PROJECT_ID) || 1;

// Test configuration
export const options = {
  scenarios: {
    // Standard load test
    standard_load: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 5 },  // Ramp up to 5 VUs over 30s
        { duration: '1m', target: 5 },   // Stay at 5 VUs for 1 minute
        { duration: '20s', target: 0 },  // Ramp down to 0 VUs
      ],
    },
    // Spike test (uncomment to use)
    /*
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '10s', target: 10 },    // Quick ramp up to 10 VUs
        { duration: '30s', target: 20 },    // Spike to 20 VUs
        { duration: '1m', target: 5 },      // Scale down to 5 VUs
        { duration: '20s', target: 0 },     // Ramp down to 0
      ],
    },
    */
  },
  thresholds: {
    http_req_duration: ['p(95) < 500', 'p(99) < 1000'], // 95% of requests should complete below 500ms, 99% below 1s
    http_req_failed: ['rate<0.01'],                     // Less than 1% of requests should fail
    test_case_api_calls: ['count>100'],                 // Should execute more than 100 API calls during the test
  },
};

/**
 * Build TestRail API URL
 * @param endpoint - API endpoint path
 * @returns Full API URL
 */
function buildUrl(endpoint: string): string {
  let url = API_URL;
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return `${url}/${endpoint}`;
}

/**
 * Get auth headers for TestRail API
 * @returns HTTP headers object with authorization
 */
function getAuthHeaders(): { [key: string]: string } {
  const authString = `${EMAIL}:${API_KEY}`;
  // Using k6's encoding module for base64 encoding
  const encodedAuth = encoding.b64encode(authString);
  
  return {
    'Authorization': `Basic ${encodedAuth}`,
    'Content-Type': 'application/json'
  };
}

/**
 * Get test cases for a project
 * @param projectId - Project ID to retrieve test cases from
 * @param suiteId - Optional suite ID (if the project has multiple test suites)
 * @param filters - Optional filters for the test cases
 * @returns HTTP response
 */
function getTestCases(projectId: number, suiteId?: number, filters: Record<string, any> = {}) {
  // Build URL with required parameters
  let url = buildUrl(`get_cases/${projectId}`);
  
  // Add suite_id if provided
  if (suiteId !== undefined) {
    url += `&suite_id=${suiteId}`;
  }
  
  // Add any additional filters
  Object.keys(filters).forEach(key => {
    url += `&${key}=${filters[key]}`;
  });
  
  const params = {
    headers: getAuthHeaders(),
  };
  
  // Track API calls with custom metric
  testCaseApiCalls.add(1);
  
  return http.get(url, params);
}

// Default function that is executed by each VU
export default function() {
  // Call the API to get test cases from project with ID 1
  const response = getTestCases(PROJECT_ID);
  
  // Check response
  check(response, {
    'Status is 200': (r) => r.status === 200,
    'Response body has test cases data': (r) => {
      try {
        const responseBody = r.json();
        return Array.isArray(responseBody) && responseBody.length >= 0;
      } catch (e) {
        return false;
      }
    },
    'Response time < 300ms': (r) => r.timings.duration < 300,
  });
  
  // Sleep between 1-2 seconds to simulate user behavior
  sleep(Math.random() + 1);
}
