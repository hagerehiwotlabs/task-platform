#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const semver = require('semver');

const pkgPath = path.join(__dirname, '../package.json');
const changelogPath = path.join(__dirname, '../CHANGELOG.md');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const changelog = fs.readFileSync(changelogPath, 'utf8');

// Extract latest version from changelog
const versionMatch = changelog.match(/## \[(\d+\.\d+\.\d+)\]/);
if (!versionMatch) {
  console.error('❌ No version found in CHANGELOG.md');
  process.exit(1);
}

const changelogVersion = versionMatch[1];

if (pkg.version !== changelogVersion) {
  console.error('❌ Package version does not match CHANGELOG version');
  console.error(`   package.json: ${pkg.version}`);
  console.error(`   CHANGELOG.md: ${changelogVersion}`);
  console.error('');
  console.error('   Fix by updating package.json version to match CHANGELOG');
  process.exit(1);
}

// Check if version is valid semver
if (!semver.valid(pkg.version)) {
  console.error(`❌ Invalid semver version: ${pkg.version}`);
  process.exit(1);
}

console.log(`✅ Version ${pkg.version} correctly documented`);
