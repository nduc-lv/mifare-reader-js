import MifareReader from './core/MifareReader';

async function testPortOperations() {
    const reader = new MifareReader();

    try {
        console.log('=== Testing Port Initialize and Close ===\n');

        // Replace 'COM3' with your actual serial port
        // Common ports: COM1, COM3, COM4 on Windows
        // /dev/ttyUSB0, /dev/ttyACM0 on Linux
        // /dev/cu.usbserial on macOS
        const portName = 'COM5'; // Change this to your port
        const baudRate = 19200;

        // Test 1: Initialize the port
        console.log(`Test 1: Initializing port ${portName} at ${baudRate} baud...`);
        const initialized = await reader.initialize(portName, baudRate);

        if (!initialized) {
            console.error('❌ Failed to initialize card reader');
            return;
        }

        console.log('✓ Card reader initialized successfully\n');

        // Wait a bit to ensure stable connection
        await sleep(1000);

        // Test 2: Perform a quick operation to verify port is working
        console.log('Test 2: Testing port communication with LED...');
        try {
            await reader.changeLedColor('GREEN');
            console.log('✓ Port communication successful (LED changed to GREEN)\n');
        } catch (error) {
            console.error('❌ Port communication failed:', error instanceof Error ? error.message : error);
        }

        await sleep(1000);

        // Test 3: Close the port
        console.log('Test 3: Closing port...');
        reader.closePort();
        console.log('✓ Port closed successfully\n');

        await sleep(1000);

        // Test 4: Try to reinitialize the port
        console.log('Test 4: Reinitializing port...');
        const reinitialized = await reader.initialize(portName, baudRate);

        if (!reinitialized) {
            console.error('❌ Failed to reinitialize card reader');
            return;
        }

        console.log('✓ Card reader reinitialized successfully\n');

        await sleep(1000);

        // Final cleanup
        console.log('\nCleaning up...');
        reader.closePort();
        console.log('✓ Port closed');

    } catch (error) {
        console.error('\n❌ Error during test:', error instanceof Error ? error.message : error);

        // Cleanup on error
        try {
            reader.closePort();
            console.log('Port closed after error');
        } catch (closeError) {
            console.error('Failed to close port:', closeError);
        }
    }
}

// Helper function to sleep
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test
testPortOperations();
