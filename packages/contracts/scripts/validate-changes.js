#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const openapiPath = path.join(__dirname, '../src/openapi.yaml');
const typesPath = path.join(__dirname, '../src/generated/types.ts');

// Read OpenAPI spec
const openapiContent = fs.readFileSync(openapiPath, 'utf8');
const openapiHash = crypto.createHash('md5').update(openapiContent).digest('hex');

// Check if types file exists
if (!fs.existsSync(typesPath)) {
  console.error('❌ Types not generated.');
  console.error('   Run: npm run generate');
  process.exit(1);
}

// Read types file and extract hash
const typesContent = fs.readFileSync(typesPath, 'utf8');
const hashMatch = typesContent.match(/\/\/ OpenAPI Hash: (\w+)/);

if (!hashMatch) {
  console.error('❌ Types file missing hash. Regenerate types.');
  console.error('   Run: npm run generate');
  process.exit(1);
}

const typesHash = hashMatch[1];

if (typesHash !== openapiHash) {
  console.error('❌ OpenAPI spec changed without updating types.');
  console.error('   OpenAPI hash:', openapiHash);
  console.error('   Types hash:  ', typesHash);
  console.error('');
  console.error('   Steps to fix:');
  console.error('   1. Run: npm run generate');
  console.error('   2. Build package: npm run build');
  console.error('   3. Commit changes');
  process.exit(1);
}

console.log('✅ Contract changes validated');
console.log('📦 Hash:', openapiHash);
