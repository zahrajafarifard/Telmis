const { DataTypes } = require("sequelize");
const db = require("../db.js");

const Exchange = db.define("Exchange", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },

  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
  },
  authenticatedByAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  ticketExpireDate: {
    type: DataTypes.DATE,
  },
 

  securityCodeCounter: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  securityCodeExpireDate: {
    type: DataTypes.DATE,
  },
});
module.exports = Exchange;
