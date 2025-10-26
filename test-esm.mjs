// ES Module Import Test
console.log('Testing ES Module import...\n');

// Test named imports
import { MifareReader, COLORS, KEY_MODE } from './dist/esm/index.js';

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

console.log('\n✅ ES Module import test passed!');
