const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const distIndexPath = path.join(frontendDir, 'dist', 'index.html');
const nodeModulesPath = path.join(frontendDir, 'node_modules');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
    ...options,
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

const needsFrontendInstall = !fs.existsSync(nodeModulesPath);
const needsFrontendBuild = !fs.existsSync(distIndexPath);

if (needsFrontendInstall) {
  console.log('[INFO] Frontend dependencies not found. Installing dependencies...');
  run('npm', ['--prefix', frontendDir, 'install']);
}

if (needsFrontendBuild) {
  console.log('[INFO] Frontend build not found. Building the dashboard...');
  run('npm', ['--prefix', frontendDir, 'run', 'build']);
}

console.log('[INFO] Frontend asset check complete. Starting application...');
