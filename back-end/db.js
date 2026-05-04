const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("telmis-db", "root", "", {
  dialect: "mysql",
  host: "localhost",
  port: "3306",
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
