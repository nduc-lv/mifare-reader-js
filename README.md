# mifare-reader-js

A TypeScript library for interfacing with MIFARE card readers via serial port communication. This library provides a clean, promise-based API for communicating with MIFARE Classic RFID cards through serial port connections, commonly used with devices like the CR522AU or similar card readers.

## Features

- **Multi-Format Support**: Works with both CommonJS and ES Modules
- **Full TypeScript Support**: Complete type definitions for all APIs
- **Serial Communication**: Robust serial port communication using `serialport` library
- **Retry Logic**: Built-in initialization retry mechanism (up to 20 attempts by default)
- **Timeout Handling**: Configurable command timeouts prevent hanging operations
- **Hardware Integration**:
  - LED control (4 color states: GREEN, RED, YELLOW, OFF)
  - Audio feedback (beep functionality)
  - Card detection and reading
  - RF authentication with key modes (A/B)

## Tested Devices

This library has been tested and confirmed to work with the following MIFARE card reader devices:

| Brand | Model | Made By | Baudrate | Notes |
|-------|-------|---------|----------|-------|
| NfcPass | CR522AU-V7| ChinaReader | 19200 | N/A |

> **Contributing**: If you've successfully tested this library with a specific reader model, please consider contributing by adding the device information to this table. Include the brand name, model number, manufacturer, and working baudrate.

## Installation

### Prerequisites

- Node.js >= 14.0.0
- A MIFARE card reader connected via serial port
- **Compatible driver for the reader device installed**
  - **Windows**: After plugging in the device, it should be recognized in Device Manager under "Ports (COM & LPT)" section (e.g., COM3, COM5)
  - **Linux**: The device should appear as `/dev/ttyUSB0`, `/dev/ttyACM0`, or similar. Check with `ls -la /dev/tty*`
  - **macOS**: The device should appear as `/dev/cu.usbserial-*` or similar. Check with `ls -la /dev/tty.* /dev/cu.*`
  - If the device is not recognized, install the appropriate USB-to-Serial driver (e.g., CH340, CP2102, FTDI drivers)

### Install from npm

```bash
npm install mifare-reader-js
```

### Install from Local Directory

```bash
npm install /path/to/mifare-reader-js
```

### Install from Package File

```bash
npm pack
npm install ./mifare-reader-js-1.0.0.tgz
```

## Quick Start

> **Note**: If the device does not respond during initialization, try changing the baudrate. Common values are `9600`, `19200`, `57600`, or `115200`. Different reader models may use different default baudrates.

### TypeScript Example

```typescript
import { MifareReader, COLORS } from 'mifare-reader-js';

const reader = new MifareReader();

async function readCard() {
  try {
    // Initialize reader on COM3 at 19200 baud
    await reader.initialize('COM3', 19200);

    // Detect a card
    const cardId = await reader.selectCard();

    if (cardId) {
      console.log('Card detected:', cardId);

      // Visual feedback: turn LED green
      await reader.changeLedColor(COLORS.GREEN);

      // Read card data with default MIFARE key
      const data = await reader.readCard();
      console.log('Card data:', data);

      // Audio feedback
      await reader.beep();
    } else {
      console.log('No card detected');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    reader.closePort();
  }
}

readCard();
```

### JavaScript (CommonJS) Example

```javascript
const { MifareReader, COLORS } = require('mifare-reader-js');

const reader = new MifareReader();

async function main() {
  try {
    await reader.initialize('COM3', 19200);
    const cardId = await reader.selectCard();

    if (cardId) {
      await reader.changeLedColor(COLORS.GREEN);
      await reader.beep();
      const data = await reader.readCard();
      console.log('Card data:', data);
    }
  } finally {
    reader.closePort();
  }
}

main();
```

## API Reference

### MifareReader Class

#### Constructor

```typescript
const reader = new MifareReader();
```

#### Methods

##### `initialize(portNo: string, baudRate: 9600 | 19200 | 57600 | 115200, maxRetries?: number): Promise<boolean>`

Initializes connection to the card reader device.

**Parameters:**
- `portNo` - Serial port name
  - Windows: `'COM1'`, `'COM3'`, etc.
  - Linux/Mac: `'/dev/ttyUSB0'`, `'/dev/ttyACM0'`, etc.
- `baudRate` - Communication speed (default: 19200)
  - Supported values: `9600`, `19200`, `57600`, `115200`
- `maxRetries` - Maximum retry attempts (default: 20)

**Returns:** Promise resolving to `true` if successful, `false` otherwise

**Example:**
```typescript
await reader.initialize('COM3', 19200);
```

---

##### `selectCard(): Promise<string | null>`

Attempts to detect and select a card in the reader.

**Returns:** Promise resolving to:
- Card ID as a hex string if card is detected
- `null` if no card is detected

**Example:**
```typescript
const cardId = await reader.selectCard();
if (cardId) {
  console.log('Card ID:', cardId);
}
```

---

##### `readCard(key?: string | Buffer, keyMode?: 'A' | 'B'): Promise<string>`

Reads data from the selected card. Requires successful authentication first.

**Parameters:**
- `key` - 6-byte authentication key (hex string or Buffer)
  - Default: `'ffffffffffff'` (default MIFARE key)
  - Must be 6 bytes/12 hex characters
- `keyMode` - Authentication key mode
  - `'A'` (default) or `'B'`

**Returns:** Promise resolving to card data as a hex string (16 bytes)

**Note:** This method internally calls `authen()` for authentication.

**Example:**
```typescript
// Using default key
const data = await reader.readCard();

// Using custom key with mode B
const data = await reader.readCard('123456789abc', 'B');
```

---

##### `authen(key?: string | Buffer, keyMode?: 'A' | 'B'): Promise<boolean>`

Authenticates with the card using the specified key. Must be called before `readCard()`.

**Parameters:**
- `key` - 6-byte authentication key (default: `'ffffffffffff'`)
- `keyMode` - Key mode `'A'` or `'B'` (default: `'A'`)

**Returns:** Promise resolving to `true` if authentication successful, `false` otherwise

**Example:**
```typescript
const authenticated = await reader.authen('ffffffffffff', 'A');
if (authenticated) {
  const data = await reader.readCard();
}
```

---

##### `changeLedColor(color: 'GREEN' | 'RED' | 'YELLOW' | 'OFF'): Promise<boolean>`

Controls the reader's LED indicator.

**Parameters:**
- `color` - LED color state
  - `'GREEN'` - Green LED
  - `'RED'` - Red LED
  - `'YELLOW'` - Yellow LED
  - `'OFF'` - Turn off LED

**Returns:** Promise resolving to `true` if successful, `false` otherwise

**Example:**
```typescript
import { COLORS } from 'mifare-reader-js';

await reader.changeLedColor(COLORS.GREEN);
```

---

##### `beep(): Promise<boolean>`

Triggers the reader's audio indicator.

**Returns:** Promise resolving to `true` if successful, `false` otherwise

**Example:**
```typescript
await reader.beep();
```

---

##### `closePort(): void`

Closes the serial port connection. Should be called for proper cleanup.

**Example:**
```typescript
reader.closePort();
```

---

## Constants

### COLORS

```typescript
import { COLORS } from 'mifare-reader-js';

console.log(COLORS.GREEN);   // "GREEN"
console.log(COLORS.RED);     // "RED"
console.log(COLORS.YELLOW);  // "YELLOW"
console.log(COLORS.OFF);     // "OFF"
```

### KEY_MODE

```typescript
import { KEY_MODE } from 'mifare-reader-js';

console.log(KEY_MODE.A);  // Buffer [0x61]
console.log(KEY_MODE.B);  // Buffer [0x60]
```

---

## Port Configuration

To find your serial port:

### Windows

- Check Device Manager → Ports (COM & LPT)
- Common ports: `COM1`, `COM3`, `COM5`
- Use `node -e "require('serialport').SerialPort.list().then(ports => console.log(ports))"`

### Linux

```bash
# List all serial ports
ls -la /dev/tty*

# Common ports: /dev/ttyUSB0, /dev/ttyACM0
dmesg | grep tty  # Check kernel messages
```

### macOS

```bash
# List all serial ports
ls -la /dev/tty.* /dev/cu.*

# Common ports: /dev/cu.usbserial-*, /dev/cu.SLAB_USBtoUART
```

---

## Development Guide

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn
- TypeScript knowledge (recommended)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mifare-reader-js
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Project Structure

```
mifare-reader-js/
├── src/
│   ├── core/
│   │   └── MifareReader/
│   │       └── index.ts              # Main MifareReader class
│   ├── types/
│   │   └── types.ts                  # Type definitions and constants
│   ├── example-test-*.ts             # Usage examples
│   └── index.ts                      # Main entry point
├── dist/
│   ├── cjs/                          # CommonJS compiled output
│   └── esm/                          # ES Module compiled output
├── scripts/
│   └── create-esm-package.js         # ESM build helper
├── package.json
├── tsconfig.json                     # TypeScript config (CommonJS)
├── tsconfig.esm.json                 # TypeScript config (ES Modules)
└── README.md
```

### Build Scripts

```bash
# Build both CommonJS and ES Module formats
npm run build

# Build only CommonJS
npm run build:cjs

# Build only ES Module
npm run build:esm

# Development mode (ts-node)
npm run dev
```

### Compilation Details

#### CommonJS Build
- Configuration: `tsconfig.json`
- Output: `dist/cjs/`
- Target: ES2020
- Module: CommonJS

#### ES Module Build
- Configuration: `tsconfig.esm.json`
- Output: `dist/esm/`
- Target: ES2020
- Module: ES2020
- Creates `package.json` with `"type": "module"`

### TypeScript Configuration

The project uses strict TypeScript settings:
- Strict mode enabled
- Source maps included
- Declaration files (.d.ts) generated

### Example Files

Run the example files to test functionality:

```bash
# Using ts-node directly
npx ts-node src/example-test-readcard.ts

# Or with npm script
npm run dev src/example-test-readcard.ts
```

Available examples:
- `example-test-readcard.ts` - Card detection and data reading
- `example-test-led.ts` - LED color control
- `example-test-beep.ts` - Audio feedback
- `example-test-port.ts` - Basic port connectivity
- `example-test-select-card.ts` - Card selection/detection
- `example-test-mixing.ts` - Combined operations

**Note:** Update the port and baud rate in examples before running.

### Making Changes

1. Modify source files in `src/`
2. Run `npm run build` to compile
3. Test changes with example files
4. Check compiled output in `dist/` directory

### Adding New Features

1. Add types to `src/types/types.ts`
2. Implement functionality in `src/core/MifareReader/index.ts`
3. Export new types/methods in `src/index.ts`
4. Create example file to demonstrate usage
5. Build and test with `npm run build`

---

## Publishing to npm

1. Create npm account at https://www.npmjs.com
2. Login locally:
```bash
npm login
```

3. Update `package.json` metadata:
   - Update version in `version` field
   - Add your username to `author` field
   - Update `repository.url`, `bugs.url`, and `homepage`

4. Publish:
```bash
npm publish
```

The `prepublishOnly` script automatically builds before publishing.

---

## Troubleshooting

### Port Not Found

- Verify the port name matches your system
- Check Device Manager (Windows) or `ls /dev/tty*` (Linux/Mac)
- Ensure the reader is properly connected and recognized by the OS

### Connection Fails

- Try different baud rates (9600, 19200, 57600, 115200)
- Verify the reader is powered and properly connected
- Check for driver issues (Windows: USB drivers may need installation)
- Increase `maxRetries` parameter

### Card Not Detected

- Ensure card is properly positioned in the reader
- Try moving the card slightly to find the sweet spot
- Check if the reader's LED is functioning
- Verify card is a MIFARE Classic card

### Authentication Fails

- Verify the key is correct (should be 6 bytes/12 hex characters)
- Try the default key `'ffffffffffff'`
- Ensure key mode ('A' or 'B') matches the card configuration
- Check card is still properly positioned

### Module Import Issues

- For CommonJS: `const { MifareReader } = require('mifare-reader-js');`
- For ES Modules: `import { MifareReader } from 'mifare-reader-js';`
- Ensure build output exists: `npm run build`

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes and version updates.

### Latest Version (1.0.3)
- **Fixed**: Select card ID issue - `selectCard()` now returns correct card ID

---

## License

ISC

---

## Resources

- [serialport Documentation](https://serialport.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

## Contributing

Contributions are welcome! Please ensure:
- Code follows TypeScript strict mode
- Changes are properly tested
- Documentation is updated
- Build passes without errors: `npm run build`
