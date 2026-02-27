const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Generating TypeScript types from OpenAPI...');

try {
  // Check if openapi-typescript is installed
  try {
    require.resolve('openapi-typescript');
  } catch {
    console.log('Installing openapi-typescript...');
    execSync('npm install openapi-typescript', { stdio: 'inherit' });
  }

  // Generate TypeScript types
  execSync('npx openapi-typescript src/openapi.yaml --output src/generated/types.ts', {
    stdio: 'inherit',
  });

  console.log('✅ Types generated at packages/contracts/src/generated/types.ts');

  // Format the generated file
  const generatedPath = path.join(__dirname, '../src/generated/types.ts');
  console.log('🎨 Formatting generated types...');
  execSync(`npx prettier --write ${generatedPath}`, { stdio: 'inherit' });
  console.log('✅ Types formatted');
} catch (error) {
  console.error('❌ Type generation failed:', error.message);
  process.exit(1);
}
