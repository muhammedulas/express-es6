"use strict";

var _encryption = require("../shared_modules/encryption");

var _db = require("../shared_modules/db");

var express = require('express');

var router = express.Router();
var ec = new _encryption.Encryption();
var db = new _db.Database();
/* GET users listing. */

router.get('/', function (req, res, next) {
  var users = [];
  db.FSMDB.query("select * from Users").then(function (dbres) {
    res.send(ec.encrypt(JSON.stringify(dbres)));
  });
});
module.exports = router;