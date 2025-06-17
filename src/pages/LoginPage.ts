import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessageContainer: Locator;
    readonly rememberMeCheckbox: Locator;
    readonly forgotPasswordLink: Locator;    constructor(page: Page) {
        this.page = page;
        
        // Specific selectors for your TestRail version
        this.emailInput = page.locator('input[name="name"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('#button_primary');
        this.errorMessageContainer = page.locator('.error-container, .error, .loginpage-message-error, .message-error, p.error');
        this.rememberMeCheckbox = page.locator('input[name="rememberme"]');
        this.forgotPasswordLink = page.locator('a:has-text("Forgot your password?")');
    }    /**
     * Navigate to the login page
     */
    async goto(): Promise<void> {
        // Navigate to the TestRail login page using the correct URL
        await this.page.goto('/index.php?/auth/login');
        
        // Wait for login form to be visible using the emailInput locator
        await this.emailInput.waitFor({ state: 'visible' });
    }/**
     * Log in with the specified credentials
     * 
     * @param email User email
     * @param password User password
     */
    async login(email: string, password: string): Promise<void> {        // Wait for form to be ready
        await this.emailInput.waitFor({ state: 'visible' });
        
        // Clear fields first to ensure clean state
        await this.emailInput.clear();
        await this.emailInput.fill(email);
        
        await this.passwordInput.clear();
        await this.passwordInput.fill(password);
          // Submit form
        await this.loginButton.click();
          // Wait for navigation to stabilize
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Log in with the remember me option checked
     * 
     * @param email User email
     * @param password User password
     */
    async loginWithRememberMe(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.rememberMeCheckbox.check();
        await this.loginButton.click();
    }    /**
     * Get the error message from the login page
     */
    async getErrorMessage(): Promise<string> {        try {
            await expect(this.errorMessageContainer).toBeVisible();
            const content = await this.errorMessageContainer.textContent();
            return content || '';
        } catch (error) {
            // Check for any visible error on the page as fallback
            const anyError = this.page.locator('text=/error|invalid|incorrect|failed/i').first();
            try {
                await expect(anyError).toBeVisible();
                return await anyError.textContent() || 'Error detected but message not extracted';
            } catch (e) {
                console.warn('Could not find any error message on the page');
                return 'No visible error message found';
            }
        }
    }

    /**
     * Click on the forgot password link
     */
    async clickForgotPassword(): Promise<void> {
        await this.forgotPasswordLink.click();
    }
}
