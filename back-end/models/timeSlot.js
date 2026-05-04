const Sequelize = require("sequelize");

const sequelize = require("../db");
const TimeSlot = sequelize.define("TimeSlot", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  startTime: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.DataTypes.NOW,
  },
  remainingPerson: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 3,
  },
});

module.exports = TimeSlot;
