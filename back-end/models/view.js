const { DataTypes } = require("sequelize");
const db = require("../db");

const View = db.define("View", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ip: {
    type: DataTypes.STRING,
  },
});

module.exports = View;
