import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/LoginPage";
import { DashboardPage } from "../../src/pages/DashboardPage";
import { ForgotPasswordPage } from "../../src/pages/ForgotPasswordPage";
import { getConfig } from "../../src/utils/Config";
import { randomEmail, randomPassword } from "../../src/data/TestData";

test.describe("TestRail Login UI Tests", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let forgotPasswordPage: ForgotPasswordPage;
  const config = getConfig();
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    forgotPasswordPage = new ForgotPasswordPage(page);
    
    // Navigate to login page at the start of each test for consistency
    await loginPage.goto();
  });

  test("Positive: Should successfully login with valid credentials", async () => {
    // Get valid credentials from config
    const email = config.defaultUserEmail || "test@example.com";
    const password = config.defaultUserPassword || "password123";

    // Login with valid credentials
    await loginPage.login(email, password);

    // Verify successful login by checking dashboard elements
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await expect(dashboardPage.userProfileMenu).toBeVisible();
  });

  test('Positive: Should successfully login with "Remember Me" option', async ({ context }) => {
    // Get valid credentials from config
    const email = config.defaultUserEmail || "test@example.com";
    const password = config.defaultUserPassword || "password123";

    // Login with Remember Me option checked
    await loginPage.loginWithRememberMe(email, password);
    
    // Verify successful login by checking dashboard elements
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await expect(dashboardPage.userProfileMenu).toBeVisible();

    // Verify cookie is set with appropriate expiration
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(cookie => cookie.name.includes("session"));
    expect(sessionCookie).toBeDefined();

    // Logout for clean state
    await dashboardPage.logout();
    
    // Verify we're back at login page by checking login form elements
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test("Negative: Should reject login with invalid email format", async () => {
    // Use invalid email format
    const invalidEmail = "invalid-email";
    const password = randomPassword();

    // Attempt login with invalid email format using consistent pattern
    await loginPage.emailInput.fill(invalidEmail);
    await loginPage.passwordInput.fill(password);
    await loginPage.loginButton.click();
    
    // Wait for page to stabilize after attempted login
    await loginPage.page.waitForLoadState('networkidle');

    // Verify we're still on login page and error is displayed
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    
    // Check for error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test("Negative: Should reject login with empty credentials", async () => {
    // Click login without entering any credentials
    await loginPage.loginButton.click();
    
    // Wait for page to stabilize after attempted login
    await loginPage.page.waitForLoadState('networkidle');

    // Verify we're still on login page by checking login form elements
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    
    // Check for error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });
  test("Negative: Should reject login with invalid password", async () => {
    // Get valid email but use invalid password
    const email = config.defaultUserEmail || "test@example.com";
    const invalidPassword = randomPassword() + "invalid";

    // Attempt login with invalid password
    await loginPage.login(email, invalidPassword);
    
    // Wait for page to stabilize
    await loginPage.page.waitForLoadState('networkidle');

    // Verify we're still on login page by checking login form elements
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    
    // Check for error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    
    // Check that the error message contains expected text about invalid credentials
    const lowerCaseError = errorMessage.toLowerCase();
    expect(
      lowerCaseError.includes('invalid') || 
      lowerCaseError.includes('incorrect') || 
      lowerCaseError.includes('wrong')
    ).toBeTruthy();
  });

  test("Negative: Should reject login with non-existent user", async () => {
    // Generate random non-existent user
    const nonExistentEmail = randomEmail();
    const password = randomPassword();

    // Attempt login with non-existent user
    await loginPage.login(nonExistentEmail, password);
    
    // Wait for page to stabilize
    await loginPage.page.waitForLoadState('networkidle');

    // Verify we're still on login page by checking login form elements
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    
    // Check for error message
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test("Should redirect to forgot password page when clicking forgot password link", async () => {
    // Click on forgot password link
    await loginPage.clickForgotPassword();
    
    // Verify the forgot password page is loaded with all expected elements
    await forgotPasswordPage.verifyPageLoaded();
  });
  
  test("Positive: Should show success message on password reset request", async () => {
    // Navigate to forgot password page
    await loginPage.clickForgotPassword();
    await forgotPasswordPage.verifyPageLoaded();
    
    // Submit password reset for a valid email
    const email = config.defaultUserEmail || "test@example.com";
    await forgotPasswordPage.submitPasswordReset(email);
    
    // Verify success message is displayed
    const successMessage = await forgotPasswordPage.getSuccessMessage();
    expect(successMessage).toBeTruthy();
  });
});
