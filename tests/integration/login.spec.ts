import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { getConfig } from '../../src/utils/Config';
import { generateTestUser } from '../../src/data/TestData';

test.describe('TestRail Authentication Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  const config = getConfig();

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('Should login with valid credentials', async ({ page }) => {
    // Get credentials from config
    const email = config.defaultUserEmail || 'test@example.com';
    const password = config.defaultUserPassword || 'password123';
    
    // Navigate to login page
    await loginPage.goto();
    
    // Login with credentials
    await loginPage.login(email, password);
      // Verify successful login - TestRail shows the dashboard after login
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await expect(dashboardPage.userProfileMenu).toBeVisible();
  });

  test('Should reject invalid credentials', async ({ page }) => {
    const testUser = generateTestUser();
    
    // Navigate to login page
    await loginPage.goto();
    
    // Attempt login with invalid credentials
    await loginPage.login(testUser.email, testUser.password);
    
    // Verify error message is displayed
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username/password is incorrect');
      // Verify we're still on the login page by checking form elements
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
  });
});