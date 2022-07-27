import { DataTypes, Model } from 'sequelize';
import { Database } from '../server/shared_modules/db';

const db = new Database();


export class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nr: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    passwordKey: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordKey1: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    passwordKey2: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    profilePhotoURL: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    blocked: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    surname: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    isAdmin: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
    },
    ERPToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    authKey: {
        type: DataTypes.STRING,
        allowNull: true
    },
    defaultWorkspaceNr: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    LogoUserID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    loginLimit: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize: db.FSMDB,
    modelName: "User",
    tableName: "Users"
})