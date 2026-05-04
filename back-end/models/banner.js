const { DataTypes } = require("sequelize");
const db = require("../db.js");

const Banner = db.define("Banner", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  image_screen500: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_screen900: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_screen1440: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_screen1980: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
module.exports = Banner;
