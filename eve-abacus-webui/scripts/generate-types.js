const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Use the local swagger file instead of trying to fetch from localhost
const swaggerFile = path.join(__dirname, '..', '..', 'swagger.json');

// Check if the swagger file exists before trying to generate types
if (!fs.existsSync(swaggerFile)) {
  console.log('⚠️  Swagger file not found, skipping type generation and using fallback types');
  process.exit(0);
}

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