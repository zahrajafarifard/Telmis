const { DataTypes } = require("sequelize");
const db = require("../db.js");

const Factor = db.define("Factor", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  netPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shippingCost: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    // allowNull: false,
  },

  trackingCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
module.exports = Factor;
