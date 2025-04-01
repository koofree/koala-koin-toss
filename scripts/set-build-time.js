import { writeFileSync } from 'fs';
import { join } from 'path';

// Get current timestamp
const now = new Date();
const buildTime = now.toISOString();

// Create or update .env file
const envPath = join(process.cwd(), '.env');
const envContent = `BUILD_TIME=${buildTime}
`;

writeFileSync(envPath, envContent);

console.log('Build time environment variables have been set:');
console.log(`BUILD_TIME: ${buildTime}`);
