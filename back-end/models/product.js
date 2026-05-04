const { DataTypes } = require("sequelize");
const db = require("../db.js");

const Product = db.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },

    mainTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subTitle: {
      type: DataTypes.STRING,
    },
    identifier: {
      type: DataTypes.STRING,
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.INTEGER,
    },

    description: {
      type: DataTypes.TEXT,
      // allowNull: false,
    },

    bestSelling: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { paranoid: true } //enable soft deletion :)
);
module.exports = Product;
