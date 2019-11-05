// Type definitions for Chain Encryption 0.1.0
// Project: Chain Encryption
// Definitions by: Randy Chang

export function EncryptionModuleFactory(): EncryptionModule

export interface EncryptionModule {
    encryption: encryptionDictionary;
    addEncryption(name: string, primaryEncryption: string, primaryKey: string, secondaryEncryption?: string, secondaryKey?: string, offset?: number, step?: number): void;
    removeEncryption(index: number): void;
    runEncrypt(plaintext: string): Promise<string>;
    runDecrypt(ciphertext: string): Promise<string>;
    exportEncryptionChain(): Promise<string>;
    importEncryptionChain(json_data: string): void;
}

export interface encryptionDictionary {
    Rabbit: string;
    AES: string;
    DES: string;
    OneTimePad: string;
}
