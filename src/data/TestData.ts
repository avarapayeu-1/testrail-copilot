/**
 * Test data helper functions
 */

/**
 * Generate a random email address
 * @returns Random email address
 */
export function randomEmail(): string {
    const timestamp = new Date().getTime();
    return `test.user.${timestamp}@example.com`;
}

/**
 * Generate a random username
 * @param prefix - Optional prefix for the username
 * @returns Random username
 */
export function randomUsername(prefix: string = 'user'): string {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${randomString}`;
}

/**
 * Generate a random password
 * @param length - Password length (default: 10)
 * @returns Random password
 */
export function randomPassword(length: number = 10): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    return password;
}

/**
 * Test user data interface
 */
export interface TestUser {
    username: string;
    password: string;
    email: string;
}

/**
 * Generate random test user data
 * @returns Test user data
 */
export function generateTestUser(): TestUser {
    return {
        username: randomUsername(),
        password: randomPassword(),
        email: randomEmail()
    };
}
