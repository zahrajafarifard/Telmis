const { DataTypes } = require("sequelize");
const db = require("../db.js");

const favoriteProduct = db.define("favoriteProduct", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  
  },
});
module.exports = favoriteProduct;
