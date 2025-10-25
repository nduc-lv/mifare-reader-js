import MifareReader from './core/MifareReader';

async function testMixingMethods() {
    const reader = new MifareReader();

    try {
        console.log('=== MIFARE Card Reader - Mixing Methods Test ===\n');

        // Configuration
        const portName = 'COM5';
        const baudRate = 19200;

        // Step 1: Initialize the card reader
        console.log(`Step 1: Initializing card reader on ${portName} at ${baudRate} baud...`);
        const initialized = await reader.initialize(portName, baudRate);

        if (!initialized) {
            console.error('Failed to initialize card reader');
            return;
        }

        console.log('✓ Card reader initialized successfully\n');
        await sleep(500);

        // Step 2: Turn LED to RED (waiting for card)
        console.log('Step 2: Setting LED to RED (waiting for card)...');
        const ledRedResult = await reader.changeLedColor('RED');
        if (!ledRedResult) {
            console.error('✗ Failed to change LED to RED');
        } else {
            console.log('✓ LED changed to RED');
        }
        console.log();
        await sleep(1000);

        // Step 3: Wait for card
        console.log('Step 3: Please place a card on the reader...');
        let cardId = null;
        let attempts = 0;
        const maxAttempts = 20;

        while (!cardId && attempts < maxAttempts) {
            cardId = await reader.selectCard();
            if (!cardId) {
                await sleep(500);
                attempts++;
            }
        }

        if (!cardId) {
            console.log('No card detected after', maxAttempts, 'attempts');
            const ledOffResult = await reader.changeLedColor('OFF');
            if (!ledOffResult) {
                console.error('✗ Failed to turn off LED');
            }
            return;
        }

        console.log('✓ Card detected! Card ID:', cardId);
        await sleep(500);

        // Step 4: Beep to indicate card detected
        console.log('\nStep 4: Card detected - beeping...');
        const beepResult = await reader.beep();
        if (!beepResult) {
            console.error('✗ Beep failed');
        } else {
            console.log('✓ Beep completed');
        }
        await sleep(500);

        // Step 5: Change LED to YELLOW (processing)
        console.log('\nStep 5: Setting LED to YELLOW (processing)...');
        const ledYellowResult = await reader.changeLedColor('YELLOW');
        if (!ledYellowResult) {
            console.error('✗ Failed to change LED to YELLOW');
        } else {
            console.log('✓ LED changed to YELLOW');
        }
        await sleep(1000);

        // Step 6: Authenticate and read card
        console.log('\nStep 6: Authenticating and reading card data...');
        const defaultKey = 'FFFFFFFFFFFF';

        try {
            const cardData = await reader.readCard(defaultKey, 'A');

            if (cardData) {
                console.log('✓ Card read successfully!');
                console.log('  Card ID:', cardId);
                console.log('  Card Data:', cardData);

                // Step 7: Success - LED GREEN and double beep
                console.log('\nStep 7: Success! Setting LED to GREEN and beeping twice...');
                const ledGreenResult = await reader.changeLedColor('GREEN');
                if (!ledGreenResult) {
                    console.error('✗ Failed to change LED to GREEN');
                }
                await sleep(300);
                const beep1Result = await reader.beep();
                if (!beep1Result) {
                    console.error('✗ First beep failed');
                }
                await sleep(300);
                const beep2Result = await reader.beep();
                if (!beep2Result) {
                    console.error('✗ Second beep failed');
                }
                console.log('✓ Success indication completed');
            } else {
                throw new Error('Failed to read card data');
            }
        } catch (error) {
            // Step 7 (Error case): Error - LED RED and long beep
            console.error('✗ Failed to read card:', error instanceof Error ? error.message : error);
            console.log('\nStep 7 (Error): Setting LED to RED and beeping...');
            const ledRedErrorResult = await reader.changeLedColor('RED');
            if (!ledRedErrorResult) {
                console.error('✗ Failed to change LED to RED');
            }
            const beepErrorResult = await reader.beep();
            if (!beepErrorResult) {
                console.error('✗ Beep failed');
            }
            console.log('✓ Error indication completed');
        }

        await sleep(2000);

        // Step 8: Reset - Turn off LED
        console.log('\nStep 8: Resetting - turning off LED...');
        const ledOffFinalResult = await reader.changeLedColor('OFF');
        if (!ledOffFinalResult) {
            console.error('✗ Failed to turn off LED');
        } else {
            console.log('✓ LED turned off');
        }

        console.log('\n=== Test Completed Successfully ===');

    } catch (error) {
        console.error('\n❌ Error during test:', error instanceof Error ? error.message : error);

        // Error handling - Red LED and beep
        try {
            const ledErrorResult = await reader.changeLedColor('RED');
            if (!ledErrorResult) {
                console.error('✗ Failed to change LED to RED during error handling');
            }
            const beepFinalErrorResult = await reader.beep();
            if (!beepFinalErrorResult) {
                console.error('✗ Beep failed during error handling');
            }
        } catch (e) {
            console.error('Failed to indicate error:', e);
        }
    } finally {
        // Cleanup
        console.log('\nCleaning up...');
        await sleep(1000);
        reader.closePort();
        console.log('✓ Port closed');
    }
}

// Helper function to sleep
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test
testMixingMethods();
