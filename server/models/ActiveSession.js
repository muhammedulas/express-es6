import { DataTypes, Model } from 'sequelize';
import { Database } from '../shared_modules/db';

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
    deviceRef: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    source: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    startedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    sequelize: db.FSMDB,
    modelName: "ActiveSession",
    tableName: "ActiveSessions"
})