const { DataTypes } = require("sequelize");
const db = require("../db.js");

const Article = db.define("Article", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  articleTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mainImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sectionOneTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sectionOneText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sectionTwoImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sectionTwoTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sectionTwoText: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sectionThreeTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sectionThreeText: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  view: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});
module.exports = Article;
