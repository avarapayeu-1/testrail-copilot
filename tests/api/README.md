# TestRail API Tests

This directory contains API tests for TestRail using Playwright API testing capabilities.

## Project Setup

1. Make sure you have the required environment variables in your `.env` file:
   ```
   TESTRAIL_EMAIL=your_testrail_email
   TESTRAIL_API_KEY=your_testrail_api_key
   API_URL=https://your-instance.testrail.io/index.php?/api/v2
   ```

2. The API key can be generated in TestRail under: My Settings > API Keys

## Running API Tests

To run all API tests:
```
npm run test:api
```

To run a specific API test:
```
npx playwright test tests/api/project-management.spec.ts
```

## Available API Tests

- `project-management.spec.ts`: Tests for creating, updating, and deleting projects via the TestRail API
- `test-case-management.spec.ts`: Tests for creating, updating, and deleting test cases via the TestRail API
