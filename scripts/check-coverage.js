#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking test coverage thresholds...');

const thresholds = {
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80,
};

let hasError = false;

// Check frontend coverage
const frontendCoveragePath = path.join(
  __dirname,
  '../apps/frontend/coverage/coverage-summary.json'
);
if (fs.existsSync(frontendCoveragePath)) {
  console.log('\n📱 Frontend Coverage:');
  const coverage = JSON.parse(fs.readFileSync(frontendCoveragePath, 'utf8'));

  Object.entries(thresholds).forEach(([metric, threshold]) => {
    const value = coverage.total[metric].pct;
    const passed = value >= threshold;
    const icon = passed ? '✅' : '❌';
    const color = passed ? '\x1b[32m' : '\x1b[31m';

    console.log(`  ${icon} ${metric}: ${color}${value.toFixed(2)}%\x1b[0m (min: ${threshold}%)`);

    if (!passed) {
      hasError = true;
      console.log(`    ✋ Failed: ${metric} coverage is below ${threshold}%`);
    }
  });
}

// Check backend coverage
const backendCoveragePath = path.join(__dirname, '../apps/backend/coverage/coverage-summary.json');
if (fs.existsSync(backendCoveragePath)) {
  console.log('\n⚙️  Backend Coverage:');
  const coverage = JSON.parse(fs.readFileSync(backendCoveragePath, 'utf8'));

  Object.entries(thresholds).forEach(([metric, threshold]) => {
    const value = coverage.total[metric].pct;
    const passed = value >= threshold;
    const icon = passed ? '✅' : '❌';
    const color = passed ? '\x1b[32m' : '\x1b[31m';

    console.log(`  ${icon} ${metric}: ${color}${value.toFixed(2)}%\x1b[0m (min: ${threshold}%)`);

    if (!passed) {
      hasError = true;
      console.log(`    ✋ Failed: ${metric} coverage is below ${threshold}%`);
    }
  });
}

// Check contracts coverage
const contractsCoveragePath = path.join(
  __dirname,
  '../packages/contracts/coverage/coverage-summary.json'
);
if (fs.existsSync(contractsCoveragePath)) {
  console.log('\n📄 Contracts Coverage:');
  const coverage = JSON.parse(fs.readFileSync(contractsCoveragePath, 'utf8'));

  Object.entries(thresholds).forEach(([metric, threshold]) => {
    const value = coverage.total[metric].pct;
    const passed = value >= threshold;
    const icon = passed ? '✅' : '❌';
    const color = passed ? '\x1b[32m' : '\x1b[31m';

    console.log(`  ${icon} ${metric}: ${color}${value.toFixed(2)}%\x1b[0m (min: ${threshold}%)`);
  });
}

console.log('\n' + '='.repeat(50));

if (hasError) {
  console.error('\n❌ Coverage check failed!');
  console.error('   Some coverage metrics are below the required thresholds.');
  console.error('   Please add more tests to improve coverage.');
  process.exit(1);
} else {
  console.log('\n✅ All coverage thresholds met!');
  process.exit(0);
}
