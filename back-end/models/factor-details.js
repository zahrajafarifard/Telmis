const { DataTypes } = require("sequelize");
const db = require("../db.js");

const FactorDetails = db.define("FactorDetails", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  mainTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mainImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = FactorDetails;
