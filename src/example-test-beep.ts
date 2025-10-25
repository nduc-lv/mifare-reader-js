import MifareReader from './core/MifareReader';

async function testBeep() {
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

        // Test beep functionality
        console.log('Testing beep functionality...\n');

        console.log('Beep 1...');
        await reader.beep();
        await sleep(1000); // Wait 1 second

        console.log('Beep 2...');
        await reader.beep();
        await sleep(1000); // Wait 1 second

        console.log('Beep 3...');
        await reader.beep();
        await sleep(1000); // Wait 1 second

        console.log('\nBeep test completed successfully!');

    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
    }
}

// Helper function to sleep
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test
testBeep();
