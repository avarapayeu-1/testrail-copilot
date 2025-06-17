/**
 * This file reexports the specialized API classes for backward compatibility.
 * For new code, it is recommended to use the specialized API classes directly.
 */
import { APIResponse } from '@playwright/test';
import { ProjectApi } from './api/ProjectApi';
import { TestCaseApi } from './api/TestCaseApi';
import { ProjectData } from '../data/ProjectData';
import { TestCaseData } from '../data/TestCaseData';

/**
 * @deprecated Use the specialized API classes directly: ProjectApi, TestCaseApi, etc.
 * This class is maintained for backward compatibility only and delegates to the specialized API classes.
 */
export class TestRailApi {
  private projectApi: ProjectApi;
  private testCaseApi: TestCaseApi;

  constructor() {
    this.projectApi = new ProjectApi();
    this.testCaseApi = new TestCaseApi();
  }

  /**
   * Initialize the API context
   */
  async init(): Promise<void> {
    await this.projectApi.init();
    await this.testCaseApi.init();
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    await this.projectApi.dispose();
    await this.testCaseApi.dispose();
  }

  // Project-related methods delegating to ProjectApi
  /**
   * Create a new project in TestRail
   * @param projectData Project data object
   * @returns API response with created project data
   */
  async createProject(projectData: ProjectData): Promise<APIResponse> {
    return this.projectApi.createProject(projectData);
  }

  /**
   * Get project details by ID
   */
  async getProject(projectId: number): Promise<APIResponse> {
    return this.projectApi.getProject(projectId);
  }
  /**
   * Update an existing project
   * @param projectId Project ID to update
   * @param projectData Project data to update
   * @returns API response with updated project data
   */
  async updateProject(projectId: number, projectData: ProjectData): Promise<APIResponse> {
    return this.projectApi.updateProject(projectId, projectData);
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: number): Promise<APIResponse> {
    return this.projectApi.deleteProject(projectId);
  }

  /**
   * Get all projects
   */
  async getAllProjects(): Promise<APIResponse> {
    return this.projectApi.getAllProjects();
  }

  // Test case-related methods delegating to TestCaseApi
  /**
   * Create a new test case in TestRail
   * @param testCaseData Test case data object
   * @returns API response with created test case data
   */
  async createTestCase(testCaseData: TestCaseData): Promise<APIResponse> {
    return this.testCaseApi.createTestCase(testCaseData);
  }

  /**
   * Get test case details by ID
   */
  async getTestCase(caseId: number): Promise<APIResponse> {
    return this.testCaseApi.getTestCase(caseId);
  }
  
  /**
   * Get all test cases for a project or specific test suite
   */
  async getTestCases(
    projectId: number,
    suiteId?: number,
    filters: Record<string, any> = {}
  ): Promise<APIResponse> {
    return this.testCaseApi.getTestCases(projectId, suiteId, filters);
  }
  /**
   * Update an existing test case
   * @param caseId Test case ID to update
   * @param testCaseData Test case data to update
   * @returns API response with updated test case data
   */
  async updateTestCase(
    caseId: number,
    testCaseData: Partial<TestCaseData>
  ): Promise<APIResponse> {
    return this.testCaseApi.updateTestCase(caseId, testCaseData);
  }

  /**
   * Delete a test case
   */
  async deleteTestCase(caseId: number): Promise<APIResponse> {
    return this.testCaseApi.deleteTestCase(caseId);
  }
}
