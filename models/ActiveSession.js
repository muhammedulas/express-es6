import { DataTypes, Model } from 'sequelize';
import { Database } from '../server/shared_modules/db';

const db = new Database();

export class ActiveSession extends Model { }

ActiveSession.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userRef: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    workspace: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    startedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deviceRef: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: db.FSMDB,
    modelName: "User",
    tableName: "Users"
})