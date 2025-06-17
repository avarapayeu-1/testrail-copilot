import { test, expect } from '@playwright/test';
import { ProjectApi } from '../../src/helpers/api/ProjectApi';
import { TestCaseApi } from '../../src/helpers/api/TestCaseApi';
import { generateTestCaseData, generateTestCaseUpdateData } from '../../src/data/TestCaseData';
import { generateProjectData } from '../../src/data/ProjectData';
import logger from '../../src/utils/Logger';

// Configure tests to run sequentially to maintain state between tests
test.describe.configure({ mode: 'serial' });

// Store IDs globally to share between tests
let projectId: number;
let sectionId: number;
let caseId: number;

test.describe('TestRail Test Case Management API Tests', () => {
  let projectApi: ProjectApi;
  let testCaseApi: TestCaseApi;
  
  test.beforeAll(async () => {
    logger.info('=== Starting TestRail Test Case Management API Tests ===');
    
    // Create instances of specialized API classes for tests
    projectApi = new ProjectApi();
    testCaseApi = new TestCaseApi();
    
    // Initialize API contexts
    await projectApi.init();
    await testCaseApi.init();
      // Create a project for test cases
    const projectData = generateProjectData();
    const projectResponse = await projectApi.createProject(projectData);
    
    const projectResponseBody = await projectResponse.json();
    projectId = projectResponseBody.id;
    logger.info(`Created project with ID: ${projectId} for test case tests`);
    
    // Create a section for test cases
    // Note: In TestRail, cases must belong to a section
    // The section API is not implemented, but the TestRail API automatically creates 
    // a default section for new projects, which we'll use
    
    // For a newly created project, there won't be any cases yet,
    // so we'll use the default section ID of 1
    sectionId = 1;
    logger.info(`Using default section ID: ${sectionId} for test case tests`);
  });

  test.afterAll(async () => {
    // Clean up by deleting the project
    if (projectId) {
      await projectApi.deleteProject(projectId);
      logger.info(`Cleaned up project with ID: ${projectId}`);
    }
    
    // Dispose API contexts
    await projectApi.dispose();
    await testCaseApi.dispose();
    logger.info('=== Completed TestRail Test Case Management API Tests ===');
  });

  test('Should create a new test case', async () => {
    // Generate test data
    const testCaseData = generateTestCaseData(sectionId);
    
    logger.testStart('Create a new test case');
    logger.info(`Creating test case: ${testCaseData.title} in section ${sectionId}`);
      // Create test case via API
    const response = await testCaseApi.createTestCase(testCaseData);
    
    // Verify response
    expect(response.ok()).toBeTruthy();
    
    // Parse response body
    const responseBody = await response.json();
    logger.info(`Test case created with ID: ${responseBody.id}`);
    
    // Verify test case was created correctly
    expect(responseBody.title).toBe(testCaseData.title);
    expect(responseBody.section_id).toBe(testCaseData.section_id);
    if (testCaseData.priority_id) expect(responseBody.priority_id).toBe(testCaseData.priority_id);
    if (testCaseData.type_id) expect(responseBody.type_id).toBe(testCaseData.type_id);
    
    // Store case ID for subsequent tests
    caseId = responseBody.id;
    
    logger.testEnd('Create a new test case');
  });

  test('Should get test case details', async () => {
    // Ensure case ID is available
    expect(caseId).toBeDefined();
    
    logger.testStart('Get test case details');
    logger.info(`Getting details for test case ID: ${caseId}`);
    
    // Get test case details
    const response = await testCaseApi.getTestCase(caseId);
    
    // Verify response
    expect(response.ok()).toBeTruthy();
    
    // Parse response body
    const responseBody = await response.json();
    
    // Verify test case details
    expect(responseBody.id).toBe(caseId);
    expect(responseBody.section_id).toBe(sectionId);
    
    logger.testEnd('Get test case details');
  });

  test('Should update an existing test case', async () => {
    // Ensure case ID is available
    expect(caseId).toBeDefined();
    
    // Generate update data
    const updateData = generateTestCaseUpdateData();
    
    logger.testStart('Update an existing test case');
    logger.info(`Updating test case ID ${caseId} with title: ${updateData.title}`);
    
    // Update test case
    const response = await testCaseApi.updateTestCase(caseId, updateData);
    
    // Verify response
    expect(response.ok()).toBeTruthy();
    
    // Parse response body
    const responseBody = await response.json();
    
    // Verify test case was updated correctly
    expect(responseBody.title).toBe(updateData.title);
    if (updateData.priority_id) expect(responseBody.priority_id).toBe(updateData.priority_id);
    
    // TestRail may format the estimate differently (e.g., "9m" could become "9min")
    if (updateData.estimate) {
      const estimateValue = updateData.estimate.replace('m', '');
      expect(responseBody.estimate).toContain(estimateValue);
    }
    
    logger.testEnd('Update an existing test case');
  });

  test('Should delete a test case', async () => {
    // Ensure case ID is available
    expect(caseId).toBeDefined();
    
    logger.testStart('Delete a test case');
    logger.info(`Deleting test case ID: ${caseId}`);
    
    // Delete test case
    const response = await testCaseApi.deleteTestCase(caseId);
    
    // Verify response
    expect(response.ok()).toBeTruthy();
    
    // Verify test case was deleted by trying to get it
    const getResponse = await testCaseApi.getTestCase(caseId);
    expect(getResponse.ok()).toBeFalsy();
    logger.info(`Delete verification: Got status ${getResponse.status()} as expected`);
    
    logger.testEnd('Delete a test case');
  });
});
