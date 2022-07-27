import { DataTypes, Model } from 'sequelize';
import { Database } from '../server/shared_modules/db';

const db = new Database();

export class AllowedDevice extends Model { };

AllowedDevice.init({
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
    definition: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    nr: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    allowedUserID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: db.FSMDB,
    modelName: "AllowedDevice",
    tableName: "AllowedDevices"
});