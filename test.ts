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

