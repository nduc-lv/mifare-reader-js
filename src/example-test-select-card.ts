import MifareReader from './core/MifareReader';

async function testSelectCard() {
    const reader = new MifareReader();

    try {
        console.log('Initializing card reader...');

        // Replace 'COM5' with your actual serial port
        // Common ports: COM1, COM5, COM4 on Windows
        // /dev/ttyUSB0, /dev/ttyACM0 on Linux
        // /dev/cu.usbserial on macOS
        const portName = 'COM5'; // Change this to your port
        const baudRate = 19200;

        const initialized = await reader.initialize(portName, baudRate);

        if (!initialized) {
            console.error('Failed to initialize card reader');
            return;
        }

        console.log('Card reader initialized successfully');
        console.log('Waiting for card...');

        // Try to select a card
        const cardData = await reader.selectCard();

        if (cardData === null) {
            console.log('No card detected or failed to select card');
        } else {
            console.log('Card detected!');
            console.log('Card ID (hex):', cardData);
        }

    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
    }
}

// Run the test
testSelectCard();
