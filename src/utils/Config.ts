import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment types
 */
export type Environment = 'dev' | 'staging' | 'prod';

/**
 * Configuration interface
 */
export interface Config {
    baseUrl: string;
    apiUrl: string;
    defaultTimeoutMs: number;
    defaultUserEmail?: string;
    defaultUserPassword?: string;
}

/**
 * Get current environment
 * @returns Current environment type
 */
export function getEnvironment(): Environment {
    const env = process.env.TEST_ENV?.toLowerCase() as Environment;
    if (!env || !['dev', 'staging', 'prod'].includes(env)) {
        return 'dev';  // Default to dev if not specified
    }
    return env;
}

/**
 * Get configuration from environment variables
 * @returns Configuration object
 */
export function getConfig(): Config {
    const env = getEnvironment();
    
    // Read application URLs from environment variables with fallbacks
    const baseUrlMap: Record<Environment, string> = {
        dev: process.env.BASE_URL || 'https://dev.example.com',
        staging: process.env.BASE_URL || 'https://staging.example.com',
        prod: process.env.BASE_URL || 'https://example.com'
    };
    
    const apiUrlMap: Record<Environment, string> = {
        dev: process.env.API_URL || 'https://api.dev.example.com',
        staging: process.env.API_URL || 'https://api.staging.example.com',
        prod: process.env.API_URL || 'https://api.example.com'
    };
      return {
        baseUrl: process.env.BASE_URL || baseUrlMap[env],
        apiUrl: process.env.API_URL || apiUrlMap[env],
        defaultTimeoutMs: 30000,
        defaultUserEmail: process.env.USER_EMAIL,
        defaultUserPassword: process.env.USER_PASSWORD
    };
}
