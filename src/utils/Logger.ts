import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

// Extend the winston Logger type to include our custom methods
declare module 'winston' {
  interface Logger {
    testStart(testName: string): void;
    testEnd(testName: string): void;
    api(method: string, url: string, status?: number): void;
  }
}

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define log file paths
const logFile = path.join(logsDir, 'testrail-tests.log');
const errorLogFile = path.join(logsDir, 'testrail-errors.log');

// Custom format for console logs
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// Custom format for file logs
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json()
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: logFile,
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    }),
    // Separate file for error logs
    new winston.transports.File({
      filename: errorLogFile,
      level: 'error',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    })
  ]
});

// Add a method to log start of a test
logger.testStart = (testName: string): void => {
  logger.info(`====== Test Started: ${testName} ======`);
};

// Add a method to log end of a test
logger.testEnd = (testName: string): void => {
  logger.info(`====== Test Finished: ${testName} ======`);
};

// Add a method to log API calls
logger.api = (method: string, url: string, status?: number): void => {
  const statusText = status ? `[Status: ${status}]` : '';
  logger.info(`API ${method} ${url} ${statusText}`);
};

// Export default logger
export default logger;
