const { DataTypes } = require("sequelize");
const db = require("../db.js");

const FileType = db.define("FileType", {
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
module.exports = FileType;
