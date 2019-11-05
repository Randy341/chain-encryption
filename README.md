##  Chain Encryption Module [![Build Status](https://travis-ci.com/Randy341/chain-encryption.svg?branch=master)](https://travis-ci.com/Randy341/chain-encryption)
An easy-to-use library that encrypts string by applying different encryption in sequence
Decryption is done by applying decryption with the same sequence in reverse.  
Currently supported encryptions and their dependencies:
* AES (Crypto-JS)
* DES (Crypto-JS)
* Rabbit (Crypto-JS)
* One-Time-Pad (one-time-pad-es6)

Current version supports TypeScript

## Node.js (Install)  
Requirements:
- Node.js (version 8 or above.  Need ES6 async/await and typed array)
- NPM
```bash
npm install chain-encryption
````

## Usage (JavaScript)
```javascript
    const encryptionFactory = require("../").EncryptionModuleFactory;
    const assert = require('assert');
    
    const main = async () => {
        
        //This is the key for one-time-pad.  Preferably cryptographically random string
        //Search on NPM for crypto-random-string for generating secure one-time-pad key
        //NOTE: One-time-pad key has to be at least as long as the plaintext itself!
        // One-time-pad key has to be even longer if offset and step are applied.
        // OTP_key.length >= plaintext.length * step + offset
        const otp_key = `I'm sorry, Morty. It's a bummer. In reality, you're as dumb as they come. 
        And I needed those seeds real bad and I have to give 'em up just to get your parents off my back! 
        So now we're gonna have to go get more! And then we're gonna go on even more adventures after that, 
        Morty! And you're gonna keep your mouth shut about it, Morty! 
        Because the world is full of idiots that don't understand what's important, 
        and they'll tear us apart, Morty! But if you stick with me, I'm gonna accomplish great things, Morty, 
        and you're gonna be part of 'em! And together we're gonna run around, Morty, 
        we're gonna- do all of kinds of wonderful things, Morty. Just you and me, Morty.`;
    
        //generate encryption module
        const encryptionModule = encryptionFactory();

        /*
            Add encryptions one-by-one.
            
            Encryptions can also be import/export using the following functions:
            encryptionModule.exportEncryptionChain(): Promise<string>;   
            encryptionModule.importEncryptionChain(json_data: string): void;
            
            The import/export function uses json representation of the array holding encryption data, including the keys!!!
            So, use import/export function with security caution! 
        */
        encryptionModule.addEncryption("0", "Rabbit", "secret987");
        encryptionModule.addEncryption("1","AES","secret123");
        encryptionModule.addEncryption("2", "DES", "secret456");
        encryptionModule.addEncryption("3","OneTimePad",otp_key,"AES", "key123", offset=10, step=3);
    
        //Apply the encryption chain and encrypt the string.
        const ciphertext = await encryptionModule.runEncrypt("The Citadel of Ricks. It's the secret headquarters for the Council of Ricks");
        
        //Apply decrypt in reverse of the encryption chain and decrypt the ciphertext
        const plaintext = await encryptionModule.runDecrypt(ciphertext);
        
        assert(plaintext === "The Citadel of Ricks. It's the secret headquarters for the Council of Ricks");
    
    };
    
    main().then(() => {
        console.log("All tests pass!");
    }).catch(err => {
        console.log(err);
    });
```

## Usage (TypeScript)
```typescript
    import { EncryptionModuleFactory, EncryptionModule } from ".";
    
    const main = async ():Promise<void> => {
        let EM: EncryptionModule = EncryptionModuleFactory();
    
        let one_time_pad_key: string = `I'm sorry, Morty. It's a bummer. In reality, you're as dumb as they come. 
        And I needed those seeds real bad and I have to give 'em up just to get your parents off my back! 
        So now we're gonna have to go get more! And then we're gonna go on even more adventures after that, 
        Morty! And you're gonna keep your mouth shut about it, Morty! 
        Because the world is full of idiots that don't understand what's important, 
        and they'll tear us apart, Morty! But if you stick with me, I'm gonna accomplish great things, Morty, 
        and you're gonna be part of 'em! And together we're gonna run around, Morty, 
        we're gonna- do all of kinds of wonderful things, Morty. Just you and me, Morty.`;
    
        EM.addEncryption("AES", EM.encryption.AES, "secret123");
        EM.addEncryption("DES", EM.encryption.DES, "secret456");
        EM.addEncryption("OTP", EM.encryption.OneTimePad, one_time_pad_key, null, null, 10, 2);
        EM.addEncryption("Rabbit", EM.encryption.Rabbit, "secret789");
    
        const ciphertext: string = await EM.runEncrypt("Secret Location of the Citadel of Ricks");
        console.log(`Encrypted Ciphertext: ${ciphertext}`);
        const plaintext: string = await EM.runDecrypt(ciphertext);
        console.log(`Decrypted Plaintext: ${plaintext}`);
    
    };
    
    main().then(() => {
        console.log("Test pass!");
    }).catch(err => {
        console.log(err);
    });
```

## Q&A
#### Q: Why this library needs node version 8 or above?
A: Specifically, this library requires async/await and typed array feature from ES2015.  Any node or browser version supporting
these two will suffice.  Async/await is much less important as it only served as wrapper for 
async call.  You can fork your own on github and rewrite the async/await portion.  
However, the typed array feature is a must as typed array is used heavily.  

#### Q: Your library is garbage!  I don't like it!
A: Then you open PR and improve it! Or don't use it! Nobody is begging you here...   
Look, I get it.  This library isn't super optimized.  It is optimized enough for
my project, and I published this on NPM so others may take advantage of my works.  
I know some people (like those working in G-Company) 
love writing highly optimized but long and cryptic codes without documentation.   
I prefer codes that can be easily 
and quickly understood by teammate of different experience levels so they can contribute quickly.

    
    
    

