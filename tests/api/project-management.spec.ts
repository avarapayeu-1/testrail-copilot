import { test, expect } from '@playwright/test';
import { ProjectApi } from '../../src/helpers/api/ProjectApi';
import { generateProjectData, generateProjectUpdateData } from '../../src/data/ProjectData';
import logger from '../../src/utils/Logger';

// Configure tests to run sequentially to maintain state between tests
test.describe.configure({ mode: 'serial' });

// Store project ID globally to share between tests
let projectId: number;

test.describe('TestRail Project Management API Tests', () => {
  let projectApi: ProjectApi;
  
  test.beforeAll(async () => {
    logger.info('=== Starting TestRail Project Management API Tests ===');
    // Create a single instance of ProjectApi for all tests
    projectApi = new ProjectApi();
    await projectApi.init();
  });
  test.afterAll(async () => {
    await projectApi.dispose();
    logger.info('=== Completed TestRail Project Management API Tests ===');
  });

  test('Should create a new project', async () => {
    // Generate test data
    const projectData = generateProjectData();
    
    logger.testStart('Create a new project');
    logger.info(`Creating project: ${projectData.name}`);
      // Create project via API
    const response = await projectApi.createProject(projectData);
    
    // Verify response
    expect(response.ok()).toBeTruthy();
    
    // Parse response body
    const responseBody = await response.json();
    logger.info(`Project created with ID: ${responseBody.id}`);
    
    // Verify project was created correctly
    expect(responseBody.name).toBe(projectData.name);
    expect(responseBody.announcement).toBe(projectData.announcement);
    expect(responseBody.show_announcement).toBe(projectData.showAnnouncement);
    
    // Store project ID for subsequent tests
    projectId = responseBody.id;
    
    logger.testEnd('Create a new project');
  });

  test('Should get project details', async () => {
    // Ensure project ID is available
    expect(projectId).toBeDefined();
    
    logger.testStart('Get project details');
    logger.info(`Getting details for project ID: ${projectId}`);
    
    // Get project details
    const response = await projectApi.getProject(projectId);
    
    // Verify response
    expect(response.ok()).toBeTruthy();
    
    // Parse response body
    const responseBody = await response.json();
    
    // Verify project details
    expect(responseBody.id).toBe(projectId);
    
    logger.testEnd('Get project details');
  });

  test('Should update an existing project', async () => {
    // Ensure project ID is available
    expect(projectId).toBeDefined();
    
    // Generate update data
    const updateData = generateProjectUpdateData();
    
    logger.testStart('Update an existing project');
    logger.info(`Updating project ID ${projectId} with name: ${updateData.name}`);
      // Update project
    const response = await projectApi.updateProject(projectId, updateData);
    
    // Verify response
    expect(response.ok()).toBeTruthy();
    
    // Parse response body
    const responseBody = await response.json();
    
    // Verify project was updated correctly
    expect(responseBody.name).toBe(updateData.name);
    expect(responseBody.announcement).toBe(updateData.announcement);
    expect(responseBody.show_announcement).toBe(updateData.showAnnouncement);
    
    logger.testEnd('Update an existing project');
  });

  test('Should delete a project', async () => {
    // Ensure project ID is available
    expect(projectId).toBeDefined();
    
    logger.testStart('Delete a project');
    logger.info(`Deleting project ID: ${projectId}`);
    
    // Delete project
    const response = await projectApi.deleteProject(projectId);
    
    // Verify response
    expect(response.ok()).toBeTruthy();
    
    // Verify project was deleted by trying to get it
    const getResponse = await projectApi.getProject(projectId);
    expect(getResponse.ok()).toBeFalsy();
    logger.info(`Delete verification: Got status ${getResponse.status()} as expected`);
    
    logger.testEnd('Delete a project');
  });
});
