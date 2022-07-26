import { Sequelize } from 'sequelize';

export class Database {
    FSMDB = new Sequelize({
        dialect: 'mssql',
        host: process.env.FSMDB_SERVER || './sqlexpress',
        port: process.env.FSMDB_PORT || 1433,
        username: process.env.FSMDB_USERNAME || 'sa',
        password: process.env.FSMDB_PASSWORD || '',
        database: process.env.FSMDB_DATABASE || 'FSM'
    });

    TIGERDB = new Sequelize({
        dialect: 'mssql',
        host: process.env.TIGERDB_SERVER || './sqlexpress',
        port: process.env.TIGERDB_PORT || 1433,
        username: process.env.TIGERDB_USERNAME || 'sa',
        password: process.env.TIGERDB_PASSWORD || '',
        database: process.env.TIGERDB_DATABASE || 'TIGERDB'
    });
}