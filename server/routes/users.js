var express = require('express');
var router = express.Router();
import { Encryption } from '../shared_modules/encryption';
import { Database } from '../shared_modules/db';

var ec = new Encryption();
var db = new Database();

/* GET users listing. */
router.get('/', function (req, res, next) {
  var users = [];
  db.FSMDB.query(`select * from Users`).then((dbres) => {
    res.send(ec.encrypt(JSON.stringify(dbres)))
  });
});

module.exports = router;
