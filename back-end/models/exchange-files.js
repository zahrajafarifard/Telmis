const { DataTypes } = require("sequelize");
const db = require("../db.js");

const ExchangeFile = db.define("ExchangeFile", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },

  fileType: { type: DataTypes.STRING },
  file: { type: DataTypes.STRING },
  image: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
  version: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
});
module.exports = ExchangeFile;
