const { DataTypes } = require("sequelize");
const db = require("../db.js");

const ExchangeLoginHistory = db.define("ExchangeLoginHistory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },

  login: {
    type: DataTypes.DATE,
  },
  ip: {
    type: DataTypes.STRING,
  },
  device: {
    type: DataTypes.STRING,
  },
});
module.exports = ExchangeLoginHistory;
