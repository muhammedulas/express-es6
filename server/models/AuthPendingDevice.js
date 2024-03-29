import { DataTypes, Model } from 'sequelize';
import { Database } from '../shared_modules/db';

const db = new Database();

export class AuthPendingDevice extends Model { };

AuthPendingDevice.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    deviceID: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    requester: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING(150),
        allowNull: true
    }
}, {
    sequelize: db.FSMDB,
    modelName: "AuthPendingDevice",
    tableName: "AuthPendingDevices"
});