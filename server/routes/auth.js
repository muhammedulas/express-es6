var express = require('express');
import * as JWT from 'jsonwebtoken';
import { Database } from '../shared_modules/db';
import { User } from '../../models/User';
const { LoginCredential } = require('../../viewModels/LoginCredential');

var db = new Database();
var router = express.Router();

var refreshTokens = [];

//Validates the Given Login Form
function ValidateForm(data) {
    if ((data.password == undefined || null || '') || (data.username == undefined || null || '')) {
        return false
    } else return true
}


//Login Endpoint
router.post('/login', (req, res, next) => {
    let credentials = new LoginCredential();
    credentials = req.body;

    //Validaate Login Form
    if (!ValidateForm(credentials)) {
        res.sendStatus(403)
    }

    //Create Payload Information
    let payload = {
        username: credentials.username,
        password: credentials.password
    }

    //Create and Sign Token
    let access = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '15m' })

    //Create and Sign Refresh Token
    let refresh = JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET, { algorithm: 'HS384', expiresIn: '12h' })
    refreshTokens.push(refresh);

    //Send Token
    res.json({ accessToken: access, refreshToken: refresh })
});


//Token Verification Endpoint
router.post('/verify', (req, res, next) => {

    //Checks if a token provided in the authorization header. Otherwise returns error.
    if (!req.headers['authorization']) {
        res.status(400).json({
            name: "InvalidToken",
            message: "Access Token must be provided in the 'Authorization' header."
        });
    }

    //Gets the access token from request header
    let token = req.headers['authorization'].split(" ")[1]
    try {
        res.send(JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, { algorithms: 'HS256' }));
    }
    catch (err) {
        res.status(401).send(err);
    }
})


//Token Refresh Endpoint
router.post('/refresh', (req, res, next) => {
    if (!req.body.refreshToken) {
        res.status(400).json({
            name: "InvalidRefreshToken",
            message: "Refresh token must be provided."
        });
    }
    let refreshToken = req.body.refreshToken;
    let payload = {}

    try {
        payload = {
            username: JWT.decode(refreshToken).username,
            password: JWT.decode(refreshToken).password
        }
    } catch (err) {
        res.status(401).json(err);
    }


    if (refreshTokens.includes(req.body.refreshToken)) {
        res.json({ token: JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '15m' }) });
    } else {
        res.status(401).json({
            name: "InvalidRefreshToken",
            message: "Invalid or cancelled refresh token provided."
        });
    }
})


router.get('/test', (req, res) => {
    try {
        User.findAll().then((rows) => {
            res.json(rows)
        });
    } catch (err) {
        res.json(err);
    }
})


module.exports = router;