const { DataTypes } = require("sequelize");
const db = require("../db.js");

const ProductSpecification = db.define("ProductSpecification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },

  key: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false },
  selected: { type: DataTypes.BOOLEAN, defaultValue: false },
});
module.exports = ProductSpecification;
