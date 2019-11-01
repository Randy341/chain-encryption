const CryptoJS = require("crypto-js");
const OneTimePad = require("one-time-pad-es6");

class CryptoJSWrapper {
    static async rabbit_encrypt(plaintext, secret, cfg=null) {
        return CryptoJS.Rabbit.encrypt(plaintext, secret, cfg).toString();
    }

    static async rabbit_decrypt(ciphertext, secret, cfg=null) {
        return CryptoJS.Rabbit.decrypt(ciphertext, secret, cfg).toString(CryptoJS.enc.Utf8);
    }

    static async aes_encrypt(plaintext, secret, cfg=null) {
        return CryptoJS.AES.encrypt(plaintext, secret, cfg).toString();
    }

    static async aes_decrypt(ciphertext, secret, cfg=null) {
        return CryptoJS.AES.decrypt(ciphertext, secret, cfg).toString(CryptoJS.enc.Utf8);
    }

    static async des_encrypt(plaintext, secret, cfg=null) {
        return CryptoJS.DES.encrypt(plaintext, secret, cfg).toString();
    }

    static async des_decrypt(ciphertext, secret, cfg=null) {
        return CryptoJS.DES.decrypt(ciphertext, secret, cfg).toString(CryptoJS.enc.Utf8);
    }

    static async encrypt(method, plaintext, secret) {
        return CryptoJS[method].encrypt(plaintext, secret).toString();
    }

    static async decrypt(method, ciphertext, secret) {
        return CryptoJS[method].decrypt(ciphertext, secret).toString(CryptoJS.enc.Utf16);
    }

    static async CryptoHash(method, plaintext, secret) {
        return CryptoJS[method](plaintext, secret).toString(CryptoJS.enc.Utf16);
    }
}

const EncryptionModuleFactory = () => {
    //Closure-scope variable to simulate private variables, preventing outside access
    let encryptionChain = [];

    const encryptionDictionary = {
        Rabbit: "Rabbit",
        AES: "AES",
        DES: "DES",
        OneTimePad: "OneTimePad"
    };

    const encrypt = (plaintext, primary, primary_key, secondary=null, secondary_key=null, offset=0, step=1, cfg=null) => {

        switch(primary) {
            case encryptionDictionary.AES:
                return CryptoJSWrap.aes_encrypt(plaintext, primary_key, cfg);
            case encryptionDictionary.DES:
                return CryptoJSWrap.des_encrypt(plaintext, primary_key, cfg);
            case encryptionDictionary.Rabbit:
                return CryptoJSWrap.rabbit_encrypt(plaintext, primary_key, cfg);
            case encryptionDictionary.OneTimePad:
                if(secondary) {
                    return encrypt(primary_key, secondary, CryptoJS.enc.Base64.parse(secondary_key), null, null, 0, 1, { iv: CryptoJS.enc.Base64.parse(`${offset}and${step}`)}).then(encrypted_secret => {
                        let otp = new OneTimePad(encrypted_secret);
                        return otp.encryptString(plaintext, offset, step);
                    });
                } else {
                    let otp = new OneTimePad(primary_key);
                    return otp.encryptString(plaintext, offset, step);
                }
            default:
                throw new Error(`Unknown encryption type: ${primary}`);
        }
    };

    const decrypt = (ciphertext, primary, primary_key, secondary=null, secondary_key=null, offset=0, step=1, cfg=null) => {

        switch(primary) {
            case encryptionDictionary.AES:
                return CryptoJSWrap.aes_decrypt(ciphertext, primary_key, cfg);
            case encryptionDictionary.DES:
                return CryptoJSWrap.des_decrypt(ciphertext, primary_key, cfg);
            case encryptionDictionary.Rabbit:
                return CryptoJSWrap.rabbit_decrypt(ciphertext, primary_key, cfg);
            case encryptionDictionary.OneTimePad:
                if(secondary) {
                    return encrypt(primary_key, secondary, CryptoJS.enc.Base64.parse(secondary_key), null, null, 0, 1,{ iv: CryptoJS.enc.Base64.parse(`${offset}and${step}`)}).then(encrypted_secret => {
                        let otp = new OneTimePad(encrypted_secret);
                        return otp.decryptString(ciphertext, offset, step);
                    });
                } else {
                    let otp = new OneTimePad(primary_key);
                    return otp.decryptString(ciphertext, offset, step);
                }
            default:
                throw new Error(`Unknown encryption type: ${primary}`);
        }
    };


    return {
        encryption: encryptionDictionary,
        addEncryption: (name, primaryEncryption, primaryKey, secondaryEncryption=null, secondaryKey=null, offset=0, step=1) => {
            encryptionChain.push({
                name,
                primaryEncryption,
                primaryKey,
                secondaryEncryption,
                secondaryKey,
                offset,
                step
            });
        },
        removeEncryption: (index) => {
            encryptionChain.splice(index, 1);
        },
        runEncrypt: (plaintext) => {
            return encryptionChain.reduce(
                (currentFunction, encryptionDetail) => {
                    return currentFunction.then(message => {
                        const {primaryEncryption, primaryKey, secondaryEncryption, secondaryKey, offset, step} = encryptionDetail;
                        return encrypt(message, primaryEncryption, primaryKey, secondaryEncryption, secondaryKey, offset, step);
                    });
                },
                Promise.resolve(plaintext)
            );
        },
        runDecrypt: (ciphertext) => {
            return encryptionChain.reduceRight(
                (currentFunction, encryptionDetail) => {
                    return currentFunction.then(message => {
                        const {primaryEncryption, primaryKey, secondaryEncryption, secondaryKey, offset, step} = encryptionDetail;
                        return decrypt(message, primaryEncryption, primaryKey, secondaryEncryption, secondaryKey, offset, step);
                    });
                },
                Promise.resolve(ciphertext)
            );
        },
        exportEncryptionChain: async () => {
            return JSON.stringify(encryptionChain.map(encryption => {
                //strip key for export
                encryption["primaryKey"] = null;
                encryption["secondaryKey"] = null;
                encryption["offset"] = null;
                encryption["step"] = null;
                return encryption;
            }));
        },
        importEncryptionChain: async (json_data) => {
            encryptionChain = JSON.parse(json_data);
            return encryptionChain;
        }
    };
};

module.exports = EncryptionModuleFactory;

