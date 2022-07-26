"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Database = void 0;

var _sequelize = require("sequelize");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Database = /*#__PURE__*/_createClass(function Database() {
  _classCallCheck(this, Database);

  _defineProperty(this, "FSMDB", new _sequelize.Sequelize({
    dialect: 'mssql',
    host: process.env.FSMDB_SERVER || './sqlexpress',
    port: process.env.FSMDB_PORT || 1433,
    username: process.env.FSMDB_USERNAME || 'sa',
    password: process.env.FSMDB_PASSWORD || '',
    database: process.env.FSMDB_DATABASE || 'FSM'
  }));

  _defineProperty(this, "TIGERDB", new _sequelize.Sequelize({
    dialect: 'mssql',
    host: process.env.TIGERDB_SERVER || './sqlexpress',
    port: process.env.TIGERDB_PORT || 1433,
    username: process.env.TIGERDB_USERNAME || 'sa',
    password: process.env.TIGERDB_PASSWORD || '',
    database: process.env.TIGERDB_DATABASE || 'TIGERDB'
  }));
});

exports.Database = Database;