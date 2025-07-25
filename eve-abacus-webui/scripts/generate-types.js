const { execSync } = require('child_process');
const path = require('path');

// Use the local swagger file instead of trying to fetch from localhost
const swaggerFile = path.join(__dirname, '..', '..', 'swagger-output.json');

console.log(`Generating types from: ${swaggerFile}`);

try {
  execSync(`openapi-typescript "${swaggerFile}" -o src/types/generated.ts --prettier`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Types generated successfully');
} catch (error) {
  console.error('❌ Failed to generate types:', error.message);
  console.log('Continuing with fallback types...');
  // Don't exit with error code, just log and continue
  // The fallback types in generated.ts will be used
} 