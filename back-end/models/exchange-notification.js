const { DataTypes } = require("sequelize");
const db = require("../db.js");

const ExchangeNotification = db.define("ExchangeNotification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },

  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  actionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("unread", "read"),
    defaultValue: "unread",
  },
});
module.exports = ExchangeNotification;
