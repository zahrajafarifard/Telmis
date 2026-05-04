const { DataTypes } = require("sequelize");
const db = require("../db.js");

const ProductImage = db.define(
  "ProductImage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },

    secondImage: { type: DataTypes.STRING },
    thirdImage: { type: DataTypes.STRING },
    fourthImage: { type: DataTypes.STRING },
  },
  { paranoid: true }
);
module.exports = ProductImage;
