# V3 Reader SerialPort

A TypeScript library for interfacing with MIFARE card readers via serial port communication. This project provides a simple and robust API for reading MIFARE Classic cards, controlling LED indicators, and managing beep functionality.

## Features

- **Card Operations**
  - Initialize and configure card reader
  - Select/detect MIFARE cards
  - Authenticate using Key A or Key B
  - Read card data from sectors

- **Device Control**
  - LED color control (RED, GREEN, YELLOW, OFF)
  - Buzzer/beep control
  - Port management (open/close)

- **Flexible Configuration**
  - Multiple baud rate support (9600, 19200, 57600, 115200)
  - Cross-platform serial port support
  - TypeScript type safety

## Installation

```bash
npm install
```

## Dependencies

- **serialport** - Serial port communication
- **typescript** - TypeScript compiler
- **@types/node** - Node.js type definitions
- **ts-node** - TypeScript execution for development

## Project Structure

```
v3-reader-serialport/
├── src/
│   ├── core/
│   │   └── MifareReader/
│   │       └── index.ts           # Main MifareReader class
│   ├── types/
│   │   └── types.ts                # TypeScript type definitions
│   ├── index.ts                    # Project entry point
│   ├── example-test.ts             # Example: Select card
│   ├── example-test-readcard.ts    # Example: Read card data
│   ├── example-test-led.ts         # Example: LED control
│   ├── example-test-beep.ts        # Example: Beep control
│   └── example-test-port.ts        # Example: Port operations
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

### Basic Setup

```typescript
import MifareReader from './core/MifareReader';

const reader = new MifareReader();

// Initialize the reader
const initialized = await reader.initialize('COM3', 9600);

if (initialized) {
    console.log('Card reader ready!');
}
```

### Select a Card

```typescript
// Wait for a card to be placed on the reader
const cardId = await reader.selectCard();

if (cardId) {
    console.log('Card detected:', cardId);
} else {
    console.log('No card detected');
}
```

### Read Card Data

```typescript
// Using default key (FFFFFFFFFFFF) and Key A
const cardData = await reader.readCard();

// Using custom key
const customKey = 'A0A1A2A3A4A5';
const data = await reader.readCard(customKey, 'A');

// Using Key B
const dataB = await reader.readCard('FFFFFFFFFFFF', 'B');
```

### Control LED

```typescript
// Change LED color
await reader.changeLedCorlor('GREEN');  // Success indicator
await reader.changeLedCorlor('RED');    // Error indicator
await reader.changeLedCorlor('YELLOW'); // Warning indicator
await reader.changeLedCorlor('OFF');    // Turn off LED
```

### Control Beep

```typescript
// Trigger a beep
await reader.beep();
```

### Close Port

```typescript
// When done, close the port
reader.closePort();
```

## Available Scripts

### Development

```bash
# Run TypeScript files directly
npm run test:mifare -- src/example-test.ts
```

### Build

```bash
# Compile TypeScript to JavaScript
npm run build
```

### Run Compiled Code

```bash
# Run the compiled JavaScript
npm start
```

## Example Tests

The project includes several example test files to help you get started:

### 1. Select Card Test
```bash
npm run test:mifare -- src/example-test.ts
```
Tests basic card detection and ID reading.

### 2. Read Card Test
```bash
npm run test:mifare -- src/example-test-readcard.ts
```
Tests card authentication and data reading.

### 3. LED Control Test
```bash
npm run test:mifare -- src/example-test-led.ts
```
Cycles through all LED colors (RED → GREEN → YELLOW → OFF).

### 4. Beep Test
```bash
npm run test:mifare -- src/example-test-beep.ts
```
Tests the buzzer/beep functionality with multiple beeps.

### 5. Port Operations Test
```bash
npm run test:mifare -- src/example-test-port.ts
```
Tests port initialization, closing, and different baud rates.

## Configuration

### Serial Port Setup

Before running any tests, update the port name in the example files:

**Windows:**
```typescript
const portName = 'COM3'; // or COM4, COM5, etc.
```

**Linux:**
```typescript
const portName = '/dev/ttyUSB0'; // or /dev/ttyACM0
```

**macOS:**
```typescript
const portName = '/dev/cu.usbserial'; // or similar
```

### Baud Rate

The card reader supports multiple baud rates:
- 9600 (default)
- 19200
- 57600
- 115200

```typescript
await reader.initialize('COM3', 115200);
```

## API Reference

### MifareReader Class

#### Methods

##### `initialize(portNo: string, baudRate: 9600 | 19200 | 57600 | 115200): Promise<boolean>`
Initialize the card reader and open the serial port.

##### `selectCard(): Promise<string | null>`
Detect and select a MIFARE card. Returns the card ID in hex format or null if no card detected.

##### `authen(key: Buffer | string, keyMode: 'A' | 'B'): Promise<boolean>`
Authenticate with the card using the specified key. Returns true if authentication succeeds.

##### `readCard(key: Buffer | string, keyMode: 'A' | 'B'): Promise<Buffer | null>`
Authenticate and read data from the card. Returns card data or null on failure.

##### `changeLedCorlor(color: 'GREEN' | 'RED' | 'YELLOW' | 'OFF'): Promise<void>`
Change the LED color on the card reader.

##### `beep(): Promise<void>`
Trigger a beep sound from the card reader.

##### `closePort(): void`
Close the serial port connection.

## Protocol Details

The library uses a binary protocol for communication with the card reader:

- **Command Format:** `AA BB [LENGTH] 00 00 00 [COMMAND] [DATA] [CHECKSUM]`
- **Response Format:** `AA BB [LENGTH] 00 00 00 [COMMAND] [DATA] [STATUS] [CHECKSUM]`

### Common Commands

- `SELECT_CARD`: `AA BB 05 00 00 00 05 02 07`
- `RF_AUTHEN`: `AA BB 0D 00 00 00 07 02 60 04 [KEY] [MODE]`
- `READ_CARD`: `AA BB 06 00 00 00 08 02 04 0E`
- `LED_CONTROL`: `AA BB 06 00 00 00 07 01 [COLOR] [CHECKSUM]`
- `BEEP`: `AA BB 06 00 00 00 06 01 08 0F`

## Troubleshooting

### Port Access Issues

**Windows:** Ensure your user has permission to access COM ports.

**Linux:** Add your user to the `dialout` group:
```bash
sudo usermod -a -G dialout $USER
```

**macOS:** No special permissions typically required.

### Card Not Detected

- Ensure the card is placed flat on the reader
- Check that the reader is properly powered
- Verify the baud rate matches your device
- Try reinitializing the port

### Authentication Fails

- Verify the key is correct (6 bytes / 12 hex characters)
- Try both Key A and Key B
- Default MIFARE key is `FFFFFFFFFFFF`

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For issues and questions, please open an issue on the project repository.
