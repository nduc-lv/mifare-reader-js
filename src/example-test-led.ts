import MifareReader from './core/MifareReader';

async function testLED() {
    const reader = new MifareReader();

    try {
        console.log('Initializing card reader...');

        // Replace 'COM5' with your actual serial port
        // Common ports: COM1, COM5, COM4 on Windows
        // /dev/ttyUSB0, /dev/ttyACM0 on Linux
        // /dev/cu.usbserial on macOS
        const portName = 'COM5'; // Change this to your port
        const baudRate = 9600;

        const initialized = await reader.initialize(portName, baudRate);

        if (!initialized) {
            console.error('Failed to initialize card reader');
            return;
        }

        console.log('Card reader initialized successfully\n');

        // Test different LED colors
        console.log('Testing LED colors...\n');

        // Turn LED RED
        console.log('Changing LED to RED...');
        await reader.changeLedColor('RED');
        await sleep(2000); // Wait 2 seconds

        // Turn LED GREEN
        console.log('Changing LED to GREEN...');
        await reader.changeLedColor('GREEN');
        await sleep(2000); // Wait 2 seconds

        // Turn LED YELLOW
        console.log('Changing LED to YELLOW...');
        await reader.changeLedColor('YELLOW');
        await sleep(2000); // Wait 2 seconds

        // Turn LED OFF
        console.log('Turning LED OFF...');
        await reader.changeLedColor('OFF');
        await sleep(1000); // Wait 1 second

        console.log('\nLED test completed successfully!');

    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
    }
}

// Helper function to sleep
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test
testLED();
