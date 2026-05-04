const { DataTypes } = require("sequelize");
const db = require("../db.js");

const ClientAddress = db.define("ClientAddress", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },

  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  neighbourhood: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  postalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  buildingNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  addressName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "unique_address_per_client",
  },
});
module.exports = ClientAddress;
