const { DataTypes } = require("sequelize");
const db = require("../db.js");

const Category = db.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    allowNull: false,
  },
  image: { type: DataTypes.STRING },
});
module.exports = Category;
