const { DataTypes } = require("sequelize");
const db = require("../db.js");

const Client = db.define("Client", {
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
  // resume: {
  //   type: DataTypes.TEXT,
  // },
  isResumeSentToAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },

  // resume_status: {
  //   type: DataTypes.ENUM("pending", "accepted", "refused"),
  //   defaultValue: "pending",
  //   allowNull: true,
  // },
  ticket: {
    type: DataTypes.STRING,
  },
  ticketExpireDate: {
    type: DataTypes.DATE,
  },
  securityCode: {
    type: DataTypes.STRING,
  },
  securityCodeCounter: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  securityCodeExpireDate: {
    type: DataTypes.DATE,
  },
});
module.exports = Client;
