const { DataTypes } = require("sequelize");
const db = require("../db.js");

const EmploymentType = db.define("EmploymentType", {
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
module.exports = EmploymentType;
