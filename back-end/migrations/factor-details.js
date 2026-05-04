"use strict";

module.exports = {
  // async up(queryInterface, Sequelize) {
  //   await queryInterface.addColumn("FactorDetails", "price", {
  //     type: Sequelize.STRING,
  //     allowNull: false, // Set to false if trackingCode is required
  //   });
  // },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("FactorDetails", "price");
  },
};
