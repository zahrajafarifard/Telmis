const { DataTypes } = require("sequelize");
const db = require("../db.js");

const Job = db.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  minSalary: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
  },

  duties: {
    type: DataTypes.TEXT,
  },
  workExperience: {
    type: DataTypes.STRING,
  },
  educationRequirement: {
    type: DataTypes.STRING,
  },
});
module.exports = Job;
