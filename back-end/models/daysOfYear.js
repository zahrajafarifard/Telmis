const Sequelize = require("sequelize");

const sequelize = require("../db");
const start = new Date();
start.setHours(11);
start.setMinutes(0);
start.setSeconds(0);

const end = new Date();
end.setHours(12);
end.setMinutes(0);
end.setSeconds(0);

const DaysOfYear = sequelize.define("DaysOfYear", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  dateString: {
    type: Sequelize.STRING, // ?? :)
    allowNull: false,
    unique: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  startOfDay: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: start,
  },
  endOfDay: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: end,
  },
  slotDuration: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 15,
  },
  shippingCost: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = DaysOfYear;
