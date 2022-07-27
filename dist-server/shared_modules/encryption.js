"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Encryption = void 0;

var _cryptoJs = _interopRequireDefault(require("crypto-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

var _publicKey = /*#__PURE__*/new WeakMap();

var Encryption = /*#__PURE__*/function () {
  function Encryption() {
    _classCallCheck(this, Encryption);

    _classPrivateFieldInitSpec(this, _publicKey, {
      writable: true,
      value: "FSM.Datamer.PublicKey.Server.46281973"
    });
  }

  _createClass(Encryption, [{
    key: "encrypt",
    value: function encrypt(value) {
      return _cryptoJs["default"].AES.encrypt(value, process.env.GENERAL_ENCRYPTION_SECRET).toString();
    }
  }, {
    key: "decrypt",
    value: function decrypt(textToDecrypt) {
      return _cryptoJs["default"].AES.decrypt(textToDecrypt, process.env.GENERAL_ENCRYPTION_SECRET).toString(_cryptoJs["default"].enc.Utf8);
    }
  }, {
    key: "hash",
    value: function hash(textToHash) {
      return _cryptoJs["default"].SHA3(textToHash).toString(_cryptoJs["default"].enc.Base64);
    }
  }]);

  return Encryption;
}();

exports.Encryption = Encryption;
var _default = Encryption;
exports["default"] = _default;