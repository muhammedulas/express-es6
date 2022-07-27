import { DataTypes, Model } from 'sequelize';
import { Database } from '../server/shared_modules/db';

const db = new Database();

export class BlockedDevice extends Model { };

BlockedDevice.init({
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
        type: DataTypes.STRING(150),
        allowNull: true
    },
    blockedUserID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: db.FSMDB,
    modelName: "BlockedDevice",
    tableName: "BlockedDevices"
});