import { APIResponse } from '@playwright/test';
import { BaseTestRailApi } from './BaseTestRailApi';
import logger from '../../utils/Logger';
import { TestCaseData } from '../../data/TestCaseData';

/**
 * TestRail TestCase API Helper Class
 * This class provides methods for test case-related operations in TestRail
 */
export class TestCaseApi extends BaseTestRailApi {
  /**
   * Create a new test case in TestRail
   * @param testCaseData Test case data object
   * @returns API response with created test case data
   */
  async createTestCase(testCaseData: TestCaseData): Promise<APIResponse> {
    const url = this.buildUrl(`add_case/${testCaseData.section_id}`);
    
    logger.info(`API Call: POST ${url}`);
    logger.info(`Creating test case: ${testCaseData.title} in section ${testCaseData.section_id}`);
    
    const response = await this.apiContext.post(url, {
      data: testCaseData
    });
    
    logger.info(`API Response: Status ${response.status()} for POST ${url}`);
    
    return response;
  }

  /**
   * Get test case details by ID
   * @param caseId Test case ID
   * @returns API response with test case data
   */
  async getTestCase(caseId: number): Promise<APIResponse> {
    const url = this.buildUrl(`get_case/${caseId}`);
    
    logger.info(`API Call: GET ${url}`);
    
    const response = await this.apiContext.get(url);
    
    logger.info(`API Response: Status ${response.status()} for GET ${url}`);
    
    return response;  }
  
  /**
   * Get all test cases for a project or specific test suite
   * @param projectId Project ID
   * @param suiteId Suite ID (optional if project is in single suite mode)
   * @param filters Additional filters like section_id, priority_id, etc.
   * @returns API response with list of test cases
   */
  async getTestCases(
    projectId: number,
    suiteId?: number,
    filters: Record<string, any> = {}
  ): Promise<APIResponse> {
    // Build URL with required parameters
    let url = this.buildUrl(`get_cases/${projectId}`);
    
    // Add suite_id if provided
    if (suiteId !== undefined) {
      url += `&suite_id=${suiteId}`;
    }
    
    // Add any additional filters
    Object.keys(filters).forEach(key => {
      url += `&${key}=${filters[key]}`;
    });
    
    logger.info(`API Call: GET ${url}`);
    
    const response = await this.apiContext.get(url);
    
    logger.info(`API Response: Status ${response.status()} for GET ${url}`);
      return response;
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
    const url = this.buildUrl(`update_case/${caseId}`);
    
    logger.info(`API Call: POST ${url}`);
    logger.info(`Updating test case ID: ${caseId} with data: ${JSON.stringify(testCaseData)}`);
    
    const response = await this.apiContext.post(url, {
      data: testCaseData
    });
    
    logger.info(`API Response: Status ${response.status()} for POST ${url}`);
    
    return response;
  }

  /**
   * Delete a test case
   * @param caseId Test case ID to delete
   * @returns API response
   */
  async deleteTestCase(caseId: number): Promise<APIResponse> {
    const url = this.buildUrl(`delete_case/${caseId}`);
    
    logger.info(`API Call: POST ${url}`);
    logger.info(`Deleting test case ID: ${caseId}`);
    
    const response = await this.apiContext.post(url, {});
    
    logger.info(`API Response: Status ${response.status()} for POST ${url}`);
    
    return response;
  }
}
