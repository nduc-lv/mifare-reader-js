// Main entry point for v3-reader-serialport package
export { default as MifareReader } from './core/MifareReader/index.js';

// Export all types and constants from types
export type { MifareReaderInterface, COLOR_TYPE, KEY_MODE_TYPE } from './types/types.js';
export {
    COLORS,
    OPEN_PORT_PREFIX,
    OPEN_PORT_EXPECTED_RESPONSE,
    SELECT_CARD_COMMAND,
    RF_AUTHEN_COMMAND_PREFIX,
    RF_AUTHEN_EXPECTED_RESPONSE,
    READ_CARD_COMMAND,
    LED_COMMAND_PREFIX,
    LED_EXPECTED_RESPONSE,
    BEEP_COMMAND,
    EXPECTED_BEEP_RESPONSE,
    KEY_MODE
} from './types/types.js';
