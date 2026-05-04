const { DataTypes } = require("sequelize");
const db = require("../db.js");

const Cart = db.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    default: false,
  },
  numberOfProductsInCart: {
    type: DataTypes.INTEGER,
    default: 0,
  },
});
module.exports = Cart;
