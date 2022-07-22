var express = require('express');
var router = express.Router();
import { Encryption } from '../shared_modules/encryption';
var ec = new Encryption();
/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(ec.encrypt('test'))
  res.send('respond with a resource');
});

module.exports = router;
