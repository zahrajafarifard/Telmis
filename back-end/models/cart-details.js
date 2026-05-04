const { DataTypes } = require("sequelize");
const db = require("../db.js");

const CartDetails = db.define("CartDetails", {
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
});
module.exports = CartDetails;
