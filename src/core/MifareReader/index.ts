import { SerialPort } from "serialport";
import { BEEP_COMMAND, COLOR_TYPE, COLORS, EXPECTED_BEEP_RESPONSE, KEY_MODE, KEY_MODE_TYPE, LED_COMMAND_PREFIX, LED_EXPECTED_RESPONSE, MifareReaderInterface, OPEN_PORT_EXPECTED_RESPONSE, OPEN_PORT_PREFIX, READ_CARD_COMMAND, RF_AUTHEN_COMMAND_PREFIX, RF_AUTHEN_EXPECTED_RESPONSE, SELECT_CARD_COMMAND } from "../../types/types";
import { resolve } from "path";



class MifareReader implements MifareReaderInterface {
    private port: SerialPort | null = null;
    private baudRate: 9600 | 19200 | 57600 | 115200 = 19200;
    private isOpenPort: boolean = false

    async initialize(portNo: string, baudRate: 9600 | 19200 | 57600 | 115200, maxRetries: number = 20): Promise<any> {
        this.port = new SerialPort({
            path: portNo,
            baudRate: baudRate
        })
        this.baudRate = baudRate;
        const openPortCommand = this.getOpenPortCommand(this.baudRate);

        let response = null;
        let retryCount = 0;

        // Keep trying until we get a successful response or reach max retries
        while (retryCount < maxRetries) {
            try {
                response = await this.sendCommandAndWait(openPortCommand, 3000);
                // Check if response is valid
                if (Buffer.compare(response, OPEN_PORT_EXPECTED_RESPONSE) === 0) {
                    console.log('Card reader initialized successfully')
                    this.isOpenPort = true;
                    return this.isOpenPort;
                }

                console.log(`Attempt ${retryCount + 1}: Invalid response, retrying...`);
            }
            catch (e) {
                console.log(`Attempt ${retryCount + 1}: Error occurred, retrying...`, e instanceof Error ? e.message : e);
            }

            retryCount++;

            // Small delay before retry
            if (retryCount < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log('Card reader failed to initialize after', maxRetries, 'attempts')
        this.isOpenPort = false;
        return this.isOpenPort;
    }

    async selectCard() {
        if (!this.port || !this.isOpenPort) {
            throw new Error("Port is not open");
        }
        try {
            const response = await this.sendCommandAndWait(SELECT_CARD_COMMAND);

            // Check if 3rd byte (index 2) is 0x0a
            if (response.length < 3 || response[2] !== 0x0a) {
                // FAILED TO SELECT CARD
                return null
            }

            const cardData = response.subarray(6);

            return cardData.toString('hex');
        }
        catch (e: any) {
            throw new Error(e.message);
        }
    }

    async authen(key: Buffer | string = 'ffffffffffff', keyMode: KEY_MODE_TYPE = 'A') {
        try {
            let keyBuffer: Buffer;

            if (typeof key === 'string') {
                keyBuffer = Buffer.from(key, 'hex');
            } else {
                keyBuffer = key;
            }

            if (keyBuffer.length !== 6) {
                throw new Error('Key must be exactly 6 bytes');
            }

            const km = KEY_MODE[keyMode];

            const authenCommand = Buffer.concat([RF_AUTHEN_COMMAND_PREFIX, keyBuffer, km]);

            const response = await this.sendCommandAndWait(authenCommand);

            if (Buffer.compare(response, RF_AUTHEN_EXPECTED_RESPONSE) === 0) {
                return true;
            }
            return false;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    async readCard(key: Buffer | string = 'ffffffffffff', keyMode: KEY_MODE_TYPE = 'A') {
        try {
            const authResult = await this.authen(key, keyMode);
            if (!authResult) {
                throw new Error("Failed To Authen")
            }
            const response = await this.sendCommandAndWait(READ_CARD_COMMAND);
            // Check if 3rd byte (index 2) is 0x0a
            if (response.length < 3 || response[2] !== 0x16) {
                return null
            }
            const cardData = response.subarray(9, 25);
            return cardData.toString("hex");

        }
        catch (e) {
            console.log(e);
            throw new Error("Failed To Authen");
        }
    }

    closePort() {
        this.port?.close();
    }

    private getOpenPortCommand(baudRate: number) {
        switch (baudRate) {
            case 9600: {
                return Buffer.concat([OPEN_PORT_PREFIX, Buffer.from([0x01, 0x01])]);
            }
            case 19200: {
                return Buffer.concat([OPEN_PORT_PREFIX, Buffer.from([0x03, 0x03])]);
            }
            case 57600: {
                return Buffer.concat([OPEN_PORT_PREFIX, Buffer.from([0x06, 0x06])]);
            }
            case 115200: {
                return Buffer.concat([OPEN_PORT_PREFIX, Buffer.from([0x07, 0x07])]);
            }
            default: {
                return Buffer.concat([OPEN_PORT_PREFIX, Buffer.from([0x01, 0x01])]);
            }
        }
    }

    private getChangeLedColorCommand(color: COLOR_TYPE) {
        switch (color) {
            case COLORS.GREEN: {
                return Buffer.concat([LED_COMMAND_PREFIX, Buffer.from([0x02, 0x04])]);
            }
            case COLORS.RED: {
                return Buffer.concat([LED_COMMAND_PREFIX, Buffer.from([0x01, 0x07])]);
            }
            case COLORS.YELLOW: {
                return Buffer.concat([LED_COMMAND_PREFIX, Buffer.from([0x03, 0x05])]);
            }
            default: {
                return Buffer.concat([LED_COMMAND_PREFIX, Buffer.from([0x00, 0x06])]);
            }
        }
    }

    async changeLedColor(color: COLOR_TYPE) {
        try {
            const changeLedCommand = this.getChangeLedColorCommand(color);
            const resposne = await this.sendCommandAndWait(changeLedCommand);
            if (Buffer.compare(resposne, LED_EXPECTED_RESPONSE) !== 0) {
                return false;
            }
            return true;
        }
        catch (e: any) {
            throw new Error(e.message);
        }
    }

    async beep() {
        try {
            const resposne = await this.sendCommandAndWait(BEEP_COMMAND);
            if (Buffer.compare(resposne, EXPECTED_BEEP_RESPONSE) !== 0) {
                return false;
            }
            return true;
        }
        catch (e: any) {
            throw new Error(e.message);
        }
    }

    private async sendCommandAndWait(command: Array<number> | Buffer, timeout: number = 5000): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            if (!this.port) {
                reject(new Error('Port is not open'));
                return;
            }
            const buffer = Buffer.isBuffer(command) ? command : Buffer.from(command);
            let responseData = Buffer.alloc(0);
            let timeoutId;

            // Set up data handler
            const onData = (chunk: Buffer<ArrayBuffer>) => {
                responseData = Buffer.concat([responseData, chunk]);
            };

            // Set up timeout
            timeoutId = setTimeout(() => {
                this.port!.off('data', onData);
                if (responseData.length > 0) {
                    resolve(responseData);
                } else {
                    reject(new Error('Timeout waiting for response'));
                }
            }, timeout);

            // Listen for response
            this.port.on('data', onData);

            // Write command
            this.port.write(buffer, (err) => {
                if (err) {
                    clearTimeout(timeoutId);
                    this.port!.off('data', onData);
                    reject(new Error(`Write failed: ${err.message}`));
                }
            });
        });
    }
}

export default MifareReader;
