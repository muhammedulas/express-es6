import CryptoJS from 'crypto-js';
export class Encryption {
    #publicKey = "FSM.Datamer.PublicKey.Server.46281973";
    constructor() { }

    encrypt(value) {
        return CryptoJS.AES.encrypt(value, process.env.GENERAL_ENCRYPTION_SECRET).toString();
    }

    decrypt(textToDecrypt) {
        return CryptoJS.AES.decrypt(textToDecrypt, process.env.GENERAL_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
    }

    hash(textToHash) {
        return CryptoJS.SHA3(textToHash).toString(CryptoJS.enc.Base64)
    }
}

export default Encryption