const { DataTypes } = require("sequelize");
const db = require("../db.js");

const ProductComment = db.define("ProductComment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
  },
  confirmedByAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
module.exports = ProductComment;
