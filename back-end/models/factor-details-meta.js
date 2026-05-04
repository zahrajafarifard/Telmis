const { DataTypes } = require("sequelize");
const db = require("../db.js");

const FactorDetailMeta = db.define("FactorDetailMeta", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },

  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = FactorDetailMeta;
