const { DataTypes } = require("sequelize");
const db = require("../db.js");

const Admin = db.define("Admin", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  securityCode: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});
module.exports = Admin;
