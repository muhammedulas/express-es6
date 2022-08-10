import { DataTypes, Model } from 'sequelize';
import { Database } from '../shared_modules/db';

const db = new Database();

export class DevicePermission extends Model { };

DevicePermission.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    deviceRef: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    userRef: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: db.FSMDB,
    modelName: "DevicePermission",
    tableName: "DevicePermissions"
});