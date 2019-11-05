const encryptionFactory = require("../").EncryptionModuleFactory;
const assert = require('assert');

const main = async () => {
    const otp_key = `I'm sorry, Morty. It's a bummer. In reality, you're as dumb as they come. 
    And I needed those seeds real bad and I have to give 'em up just to get your parents off my back! 
    So now we're gonna have to go get more! And then we're gonna go on even more adventures after that, 
    Morty! And you're gonna keep your mouth shut about it, Morty! 
    Because the world is full of idiots that don't understand what's important, 
    and they'll tear us apart, Morty! But if you stick with me, I'm gonna accomplish great things, Morty, 
    and you're gonna be part of 'em! And together we're gonna run around, Morty, 
    we're gonna- do all of kinds of wonderful things, Morty. Just you and me, Morty.`;

    const encryptionModule = encryptionFactory();
    encryptionModule.addEncryption("0", "Rabbit", "secret987");
    encryptionModule.addEncryption("1","AES","secret123");
    encryptionModule.addEncryption("2", "DES", "secret456");
    encryptionModule.addEncryption("3","OneTimePad",otp_key,"AES", "key123", offset=10, step=3);

    const ciphertext = await encryptionModule.runEncrypt("The Citadel of Ricks. It's the secret headquarters for the Council of Ricks");
    const plaintext = await encryptionModule.runDecrypt(ciphertext);
    assert(plaintext === "The Citadel of Ricks. It's the secret headquarters for the Council of Ricks");

};

main().then(() => {
    console.log("All tests pass!");
}).catch(err => {
    console.log(err);
});
