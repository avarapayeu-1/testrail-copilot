const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Get the test file path from command line arguments
const testFile = process.argv[2];

if (!testFile) {
  console.error('Error: Test file path is required');
  process.exit(1);
}

// Load environment variables from env.json
let envVars = {};
try {
  const envFilePath = path.join(__dirname, '..', 'env.json');
  if (fs.existsSync(envFilePath)) {
    envVars = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    console.log('Loaded environment variables from env.json');
  } else {
    console.warn('Warning: env.json file not found');
  }
} catch (error) {
  console.error('Error loading env.json:', error);
}

// Prepare command arguments for k6
const k6Args = ['run', testFile];

// Add each environment variable as a -e flag
Object.entries(envVars).forEach(([key, value]) => {
  k6Args.push('-e');
  k6Args.push(`${key}=${value}`);
});

// Run k6 with the environment variables
console.log(`Running: k6 ${k6Args.join(' ')}`);
const k6Process = spawn('k6', k6Args, { stdio: 'inherit' });

k6Process.on('close', (code) => {
  process.exit(code);
});
