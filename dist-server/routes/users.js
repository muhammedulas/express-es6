"use strict";

var _encryption = require("../shared_modules/encryption");

var express = require('express');

var router = express.Router();
var ec = new _encryption.Encryption();
/* GET users listing. */

router.get('/', function (req, res, next) {
  console.log(ec.encrypt('test'));
  res.send('respond with a resource');
});
module.exports = router;