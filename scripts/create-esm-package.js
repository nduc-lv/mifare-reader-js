const fs = require('fs');
const path = require('path');

const esmDir = path.join(__dirname, '..', 'dist', 'esm');
const packageJsonPath = path.join(esmDir, 'package.json');

// Ensure directory exists
if (!fs.existsSync(esmDir)) {
    fs.mkdirSync(esmDir, { recursive: true });
}

// Write package.json
fs.writeFileSync(packageJsonPath, JSON.stringify({ type: 'module' }, null, 2));
console.log('Created ESM package.json');
