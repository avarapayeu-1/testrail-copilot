import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardHeader: Locator;
    readonly userProfileMenu: Locator;
    readonly userMenuDropdown: Locator;
    readonly logoutOption: Locator;    constructor(page: Page) {
        this.page = page;
        // Specific selectors for your TestRail version
        this.dashboardHeader = page.locator('h1:has-text("Dashboard")');
        this.userProfileMenu = page.locator('.user-menu');
        this.userMenuDropdown = page.locator('.dropdown-menu');
        this.logoutOption = page.locator('a:has-text("Logout")');
    }

    /**
     * Logout from the application
     */
    async logout(): Promise<void> {
        await this.userProfileMenu.click();
        await this.logoutOption.click();
    }
}
