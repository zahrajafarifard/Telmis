const Sequelize = require("sequelize");

const sequelize = require("../db");
const Resume = sequelize.define("Resume", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  mobile: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  file: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  resume_status: {
    type: Sequelize.ENUM("pending", "accepted", "refused"),
    defaultValue: "pending",
    allowNull: true,
  },
});

module.exports = Resume;
