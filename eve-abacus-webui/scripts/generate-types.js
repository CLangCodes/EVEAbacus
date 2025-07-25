const { execSync } = require('child_process');

// Get the OpenAPI spec URL from environment variable or use default
const openApiUrl = process.env.OPENAPI_SPEC_URL || 'http://localhost:5000/swagger/v1/swagger.json';

console.log(`Generating types from: ${openApiUrl}`);

try {
  execSync(`openapi-typescript "${openApiUrl}" -o src/types/generated.ts --prettier`, {
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