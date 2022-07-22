import CryptoJS from 'crypto-js';
export class Encryption {
    #publicKey = "FSM.Datamer.PublicKey.Server.46281973";
    #secretKey = "Qx]ky2~`@;-:A/qa";
    constructor() { }

    encrypt(value) {
        return CryptoJS.AES.encrypt(value, this.#secretKey.trim()).toString();
    }

    decrypt(textToDecrypt) {
        return CryptoJS.AES.decrypt(textToDecrypt, this.#secretKey.trim()).toString(CryptoJS.enc.Utf8);
    }
}

export default Encryption