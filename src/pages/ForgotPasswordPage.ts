import { Page, Locator, expect } from '@playwright/test';

export class ForgotPasswordPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly emailInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
          // Initialize locators for the Forgot Password page
        this.heading = page.getByRole('heading', { name: 'Reset Your Password' });
        this.emailInput = page.locator('input[name="name"]');
        this.submitButton = page.locator('#button_primary');
        this.successMessage = page.locator('.message-success');
        this.errorMessage = page.locator('.error-container');
    }

    /**
     * Verify that the forgot password page is loaded
     */
    async verifyPageLoaded(): Promise<void> {
        await expect(this.heading).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.submitButton).toBeVisible();
    }

    /**
     * Submit the forgot password form with the specified email
     * 
     * @param email Email address to reset the password for
     */
    async submitPasswordReset(email: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.submitButton.click();
        await this.page.waitForLoadState('networkidle');
    }    /**
     * Get the success message text from the page (if present)
     */
    async getSuccessMessage(): Promise<string> {
        await expect(this.successMessage).toBeVisible();
        return (await this.successMessage.textContent()) || '';
    }

    /**
     * Get the error message text from the page (if present)
     */
    async getErrorMessage(): Promise<string> {
        await expect(this.errorMessage).toBeVisible();
        return (await this.errorMessage.textContent()) || '';
    }
}
