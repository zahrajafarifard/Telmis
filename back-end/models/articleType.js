const { DataTypes } = require("sequelize");
const db = require("../db.js");

const ArticleType = db.define("ArticleType", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
module.exports = ArticleType;
