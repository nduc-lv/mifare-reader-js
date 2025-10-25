# Using mifare-reader-js as a Node Module

## Installation

### Option 1: Install from Local Directory

```bash
npm install /path/to/v3-reader-serialport
```

### Option 2: Install from npm (after publishing)

```bash
npm install mifare-reader-js
```

### Option 3: Link for Local Development

In the package directory:
```bash
npm link
```

In your project directory:
```bash
npm link mifare-reader-js
```

## Basic Usage

> **Note:** This package supports both CommonJS (`require`) and ES Modules (`import`). Both formats work seamlessly in TypeScript, JavaScript, and all modern bundlers.

### TypeScript

```typescript
import { MifareReader, COLORS } from 'mifare-reader-js';

const reader = new MifareReader();

async function readCard() {
    // Initialize
    await reader.initialize('COM3', 9600);

    // Select card
    const cardId = await reader.selectCard();
    if (cardId) {
        console.log('Card ID:', cardId);

        // Change LED
        await reader.changeLedColor(COLORS.GREEN);

        // Read card data
        const data = await reader.readCard('FFFFFFFFFFFF', 'A');
        console.log('Card data:', data);

        // Beep
        await reader.beep();
    }

    // Cleanup
    reader.closePort();
}

readCard();
```

### JavaScript (ES6 Modules)

```javascript
import { MifareReader, COLORS } from 'mifare-reader-js';

const reader = new MifareReader();

async function readCard() {
    // Initialize
    await reader.initialize('COM3', 9600);

    // Select card
    const cardId = await reader.selectCard();
    if (cardId) {
        console.log('Card ID:', cardId);

        // Change LED
        await reader.changeLedColor(COLORS.GREEN);

        // Read card data
        const data = await reader.readCard('FFFFFFFFFFFF', 'A');
        console.log('Card data:', data);

        // Beep
        await reader.beep();
    }

    // Cleanup
    reader.closePort();
}

readCard();
```

### JavaScript (CommonJS with async/await)

```javascript
const { MifareReader, COLORS } = require('mifare-reader-js');

const reader = new MifareReader();

async function readCard() {
    // Initialize
    await reader.initialize('COM3', 9600);

    // Select card
    const cardId = await reader.selectCard();
    if (cardId) {
        console.log('Card ID:', cardId);

        // Change LED
        await reader.changeLedColor(COLORS.GREEN);

        // Read card data
        const data = await reader.readCard('FFFFFFFFFFFF', 'A');
        console.log('Card data:', data);

        // Beep
        await reader.beep();
    }

    // Cleanup
    reader.closePort();
}

readCard();
```


## Available Exports

### Classes

- `MifareReader` - Main class for card reader operations

### Types (TypeScript only)

- `MifareReaderInterface` - Interface for MifareReader
- `COLOR_TYPE` - Type for LED colors: `"GREEN" | "RED" | "YELLOW" | "OFF"`
- `KEY_MODE_TYPE` - Type for key mode: `'A' | 'B'`

### Constants

- `COLORS` - Object with LED color constants
  - `COLORS.GREEN`
  - `COLORS.RED`
  - `COLORS.YELLOW`
  - `COLORS.OFF`

- `KEY_MODE` - Object with key mode buffers
  - `KEY_MODE.A`
  - `KEY_MODE.B`

- Protocol Commands (for advanced usage):
  - `OPEN_PORT_PREFIX`
  - `OPEN_PORT_EXPECTED_RESPONSE`
  - `SELECT_CARD_COMMAND`
  - `RF_AUTHEN_COMMAND_PREFIX`
  - `RF_AUTHEN_EXPECTED_RESPONSE`
  - `READ_CARD_COMMAND`
  - `LED_COMMAND_PREFIX`
  - `LED_EXPECTED_RESPONSE`
  - `BEEP_COMMAND`
  - `EXPECTED_BEEP_RESPONSE`

## Example Project Structure

```
my-project/
├── node_modules/
│   └── mifare-reader-js/
├── package.json
└── index.js
```

### package.json

```json
{
  "name": "my-rfid-app",
  "version": "1.0.0",
  "dependencies": {
    "mifare-reader-js": "^1.0.0"
  }
}
```

### index.js

```javascript
const { MifareReader, COLORS } = require('mifare-reader-js');

const reader = new MifareReader();

async function main() {
    try {
        await reader.initialize('COM3', 9600);
        console.log('Reader initialized');

        const cardId = await reader.selectCard();
        if (cardId) {
            console.log('Card detected:', cardId);
            await reader.changeLedColor(COLORS.GREEN);
            await reader.beep();
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        reader.closePort();
    }
}

main();
```

## Publishing to npm (Optional)

1. Create an npm account at https://www.npmjs.com/

2. Login via command line:
```bash
npm login
```

3. Update package.json with your details:
   - Set `author`
   - Set `repository` URL
   - Set `homepage` URL
   - Set `bugs` URL

4. Publish:
```bash
npm publish
```

## Testing the Package Locally

Before publishing, test the package locally:

1. In the package directory, create a tarball:
```bash
npm pack
```

2. In your test project:
```bash
npm install /path/to/mifare-reader-js-1.0.0.tgz
```

3. Test your imports and functionality

## TypeScript Support

The package includes full TypeScript definitions. When using TypeScript, you'll get:

- Full autocomplete
- Type checking
- IntelliSense support

```typescript
import { MifareReader, COLOR_TYPE, KEY_MODE_TYPE } from 'mifare-reader-js';

// TypeScript will enforce correct types
const color: COLOR_TYPE = 'GREEN'; // ✓ Valid
const invalidColor: COLOR_TYPE = 'BLUE'; // ✗ Type error

const keyMode: KEY_MODE_TYPE = 'A'; // ✓ Valid
const invalidMode: KEY_MODE_TYPE = 'C'; // ✗ Type error
```
