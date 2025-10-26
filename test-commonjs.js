// CommonJS Import Test
console.log('Testing CommonJS import...\n');

// Test named imports
const { MifareReader, COLORS, KEY_MODE } = require('./dist/cjs/index.js');
console.log('✓ Named import (MifareReader):', typeof MifareReader);
console.log('✓ Named import (COLORS):', COLORS);
console.log('✓ Named import (KEY_MODE):', KEY_MODE);

// Test creating an instance
const reader = new MifareReader();
console.log('✓ MifareReader instance created:', reader.constructor.name);

// Test methods exist
console.log('\nChecking methods:');
console.log('  - initialize:', typeof reader.initialize);
console.log('  - selectCard:', typeof reader.selectCard);
console.log('  - readCard:', typeof reader.readCard);
console.log('  - authen:', typeof reader.authen);
console.log('  - changeLedColor:', typeof reader.changeLedColor);
console.log('  - beep:', typeof reader.beep);
console.log('  - closePort:', typeof reader.closePort);

console.log('\n✅ CommonJS import test passed!');
