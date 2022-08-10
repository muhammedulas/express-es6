import { DataTypes, Model } from 'sequelize';
import { Database } from '../shared_modules/db';

const db = new Database();

export class Workspace extends Model { };
Workspace.init({
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
    title: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    firmNr: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    perNr: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    connectionString: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1
    },
    dbName: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: db.FSMDB,
    modelName: "Workspace",
    tableName: "Workspaces"
});