import { DataTypes, Model } from "sequelize";
import { Database } from "../server/shared_modules/db";
const db = new Database();

export class Todo extends Model { };
Todo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userRef: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    workspace: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: false
    }
}, {
    sequelize: db.FSMDB,
    modelName: "Todo",
    tableName: "Todos"
});