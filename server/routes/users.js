var express = require('express');
var router = express.Router();
import { Encryption } from '../shared_modules/encryption';
import { Database } from '../shared_modules/db';
import { User } from '../models/User';

var ec = new Encryption();
var db = new Database();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('/users/')
});

router.get('/sync', async (req, res, next) => {
  try {
    await User.sync({ force: true, alter: true })
    res.send("Users table syncrhronised");
  } catch (err) {
    res.json(err);
  }
})

module.exports = router;
