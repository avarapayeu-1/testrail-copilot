import { APIRequestContext, request } from '@playwright/test';
import { getConfig } from '../../utils/Config';

/**
 * Base TestRail API Helper Class
 * This class provides common functionality for all TestRail API implementations
 */
export abstract class BaseTestRailApi {
  protected apiContext: APIRequestContext;
  protected apiUrl: string;
  protected authHeader: { [key: string]: string };
  
  /**
   * Create a new TestRail API helper instance
   */
  constructor() {
    const config = getConfig();
    
    // Get the API URL from environment or config
    let baseUrl = process.env.API_URL || config.apiUrl;
    
    // Ensure the base URL is properly formatted (remove trailing slash if present)
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    // Make sure the URL has the required TestRail API path
    if (!baseUrl.includes('/index.php?/api/v2')) {
      baseUrl = `${baseUrl}/index.php?/api/v2`;
    }
    
    this.apiUrl = baseUrl;
    
    // TestRail API uses Basic Auth with the API key as the password and any email as the username
    const email = process.env.TESTRAIL_EMAIL || '';
    const apiKey = process.env.TESTRAIL_API_KEY || '';
    
    const authString = Buffer.from(`${email}:${apiKey}`).toString('base64');
    this.authHeader = {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json',
    };
  }
  
  /**
   * Initialize the API context
   */
  async init(): Promise<void> {
    // Make sure the API URL doesn't end with a slash for consistency
    if (this.apiUrl.endsWith('/')) {
      this.apiUrl = this.apiUrl.slice(0, -1);
    }
    
    this.apiContext = await request.newContext({
      // Not setting baseURL since we're building full URLs manually
      extraHTTPHeaders: this.authHeader,
      ignoreHTTPSErrors: true // Ignore SSL errors for testing
    });
  }

  /**
   * Clean up resources
   */
  async dispose(): Promise<void> {
    await this.apiContext.dispose();
  }

  /**
   * Protected method for building the full URL
   * @param endpoint API endpoint
   * @returns Full URL
   */
  protected buildUrl(endpoint: string): string {
    return `${this.apiUrl}/${endpoint}`;
  }
}
