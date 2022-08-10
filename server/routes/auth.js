var express = require('express');
import * as JWT from 'jsonwebtoken';
import { Database } from '../shared_modules/db';
import { User } from '../models/User';
import { AllowedDevice } from '../models/AllowedDevice';
import { BlockedDevice } from '../models/BlockedDevice';
import { AuthPendingDevice } from '../models/AuthPendingDevice';
import { DevicePermission } from '../models/DevicePermission';
import { Workspace } from '../models/Workspace';
import { Encryption } from '../shared_modules/encryption';
import { LoginCredential } from '../viewModels/LoginCredential';
import { UserVM } from '../viewModels/UserViewModel';
import { ActiveSession } from '../models/ActiveSession';
const mapper = require('automapper-js');

var db = new Database();
var ec = new Encryption();
var router = express.Router();

var refreshTokens = [];

//Validates the Given Login Form
function ValidateForm(data) {
    if ((data.password == undefined || null || '') || (data.username == undefined || null || '')) {
        return false
    } else return true
}


//Login Endpoint
router.post('/login', async (req, res, next) => {
    let error = {};
    let credentials = new LoginCredential();
    credentials = req.body;
    let device = {};
    let session = {};

    //Validaate Login Form
    if (!ValidateForm(credentials)) {
        res.sendStatus(403);
    }

    let user = await User.findOne({ where: { username: credentials.username } })

    //***Validate User
    if (user === null || undefined) {
        error.name = "InvalidUser";
        error.message = "Provided username was not found.";
        res.status(400).json(error);
        return;
    }

    if (ec.hash(req.body.password) != user.passwordKey) {
        error.name = "IncorrectPassword";
        error.message = "Provided password is incorrect."
        res.status(401).json(error);
        return;
    }

    if (user.blocked == 1) {
        error.name = "InvalidGrant";
        error.message = "User is blocked."
        res.status(401).json(error);
        return;
    }
    //***

    //Bypasses below controls if request sent from admin panel
    if (req.headers["source"] != "management") {
        //*** Device and limits controls
        let device_id = req.headers["device_id"];

        if (device_id == null || undefined) {
            error.name = "InvalidDeviceID";
            error.message = "Device ID must pe provided.";
            res.status(403).json(error);
            return;
        }

        if (await BlockedDevice.count({ where: { deviceID: device_id } }) > 0) {
            error.name = "DeviceBlocked";
            error.message = "Your device has been blocked. Please contact your administrator."
            res.status(401).json(error);
            return;
        }

        device = await AllowedDevice.findOne({ where: { deviceID: device_id } })
        console.log(device);

        //If device has not authorized; executes below codes.
        if (device == null) {

            //Checks if device is waiting for authorization. Otherwise creates a request.
            if (await AuthPendingDevice.count({ where: { deviceID: device_id } }) > 0) {
                error.name = "DeviceNotAuthorizedYet";
                error.message = "Your device is still pending authorization. Please wait or contact your administrator.";
                res.status(401).json(error);
                return;
            } else {
                await AuthPendingDevice.create({
                    deviceID: device_id,
                    requester: user.id,
                    message: "",
                }).then(() => {
                    error.name = "DeviceNotAuthorized";
                    error.message = "Your device registration request has been sent! You can login after device authorized.";
                    res.status(401).json(error);
                    return;
                }).catch((err) => {
                    console.log(err);
                    res.status(400).json(err);
                    return;
                })
            }
            return;
        }

        //Checks users permission on current device
        if (await DevicePermission.count({ where: { userRef: user.id, deviceRef: device.id } }) < 1) {
            error.name = "UserNotPermittedOnDevice";
            error.message = "User do not have permission to use this device."
            res.status(401).json(error);
            return;
        }

        session.source = "mobile";
        session.deviceRef = device.id

        //License limit checks
        if (await ActiveSession.count({ where: { source: "mobile" } }) >= process.env.LICENSE_USER_LIMIT) {
            error.name = "UserLimitExceeded";
            error.message = "User Limit Exceeded."
            res.status(401).json(error);
            return;
        }

        //User based login limit check
        if (await ActiveSession.count({ where: { userRef: user.id } }) >= user.loginLimit & user.loginLimit != 0) {
            error.name = "UserLoginLimitExceeded";
            error.message = "This user has arrived its login limit.";
            res.status(401).json(error);
            return;
        }



        //**
    } else {
        session.source = "management"
        session.deviceRef = await AllowedDevice.findOne({ where: { deviceID: "General" } }).id;
    }

    let workspace = await Workspace.findOne({ where: { nr: req.body.workspace } });
    console.log("Workspace: ", workspace.id)

    //Prepare session information
    session.workspace = workspace.id;
    session.userRef = user.id;

    //Create session record on database
    try {
        await ActiveSession.create(session).then((s) => {
            //Adapt session variable for token payload
            session = {};
            session.id = s.id;
            session.user = {
                id: user.id,
                nr: user.nr,
                username: user.username,
                name: user.name,
                surname: user.surname,
                isAdmin: user.isAdmin,
                ERPToken: user.ERPToken,
                LogoId: user.LogoUserID
            };
            session.workspace = {
                id: workspace.id,
                nr: workspace.nr,
                title: workspace.title,
                firmNr: workspace.firmNr,
                perNr: workspace.perNr
            };
            session.device = {
                id: device.id,
                nr: device.nr,
                identifier: device.deviceID,
                definition: device.definition
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
        return;
    }

    //Create Payload Information
    let payload = {
        session: session
    }

    //Create and Sign Refresh Token
    let refresh = JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET, { algorithm: 'HS384', expiresIn: '12h' })
    payload.session.expiresAt = JWT.decode(refresh).exp

    //Create and Sign Token
    let access = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '15m' })

    ActiveSession.update({ refreshToken: refresh, startedAt: JWT.decode(refresh).iat, expiresAt: JWT.decode(refresh).exp }, { where: { id: session.id } });

    //Send Tokens
    res.json({ accessToken: access, refreshToken: refresh });
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


router.post('/test', async (req, res) => {
    let device = {};
    try {
        device = await AllowedDevice.findOne({ where: { deviceID: req.headers["device_id"] } });
    } catch (err) {
        res.json(err);
        return;
    }

    res.json({
        providedDeviceId: req.headers['device_id'],
        databaseRecord: device.deviceID
    });
    return;
})


router.post('/encrypt', (req, res) => {
    res.send(ec.encrypt(req.body.text))
})

router.post('/decrypt', (req, res) => {
    res.send(ec.decrypt(req.body.text))
})

router.post('/hash', (req, res) => {
    res.send(ec.hash(req.body.text))
})

router.get('/user/:username', (req, res) => {
    res.send(req.params.username)
})

module.exports = router;