const { DataTypes } = require("sequelize");
const db = require("../db.js");

const ProductVariableItem = db.define(
  "ProductVariableItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },

    value: { type: DataTypes.STRING, allowNull: false },
  },
  
);
module.exports = ProductVariableItem;
