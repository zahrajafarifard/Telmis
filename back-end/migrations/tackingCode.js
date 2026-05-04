"use strict";

module.exports = {
  // async up(queryInterface, Sequelize) {
  //   await queryInterface.addColumn("factors", "trackingCode", {
  //     type: Sequelize.STRING,
  //     allowNull: true, // Set to false if trackingCode is required
  //   });
  // },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn("factors", "trackingCode");
  },
};
