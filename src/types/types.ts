export interface MifareReaderInterface {
    initialize: (portNo: string, baudRate: 9600 | 19200 | 57600 | 115200) => Promise<any>
    selectCard: () => Promise<any>,
    readCard: (key: Buffer | string, keyMode: "A" | "B") => Promise<any>,
    changeLedColor: (color: "GREEN" | "RED" | "YELLOW" | "OFF") => Promise<any>,
    beep: () => Promise<any>
}