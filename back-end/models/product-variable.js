const { DataTypes } = require("sequelize");
const db = require("../db.js");

const ProductVariable = db.define("ProductVariable", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },

  variable: { type: DataTypes.STRING, allowNull: false },
});
module.exports = ProductVariable;
