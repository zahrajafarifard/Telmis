'use strict';

module.exports = {
  // up: async (queryInterface, Sequelize) => {
  //   // Rename table from 'old_table_name' to 'new_table_name'
  //   await queryInterface.renameTable('ClientNotifications', 'ExchangeNotifications');
  // },

  down: async (queryInterface, Sequelize) => {
    // Rollback: rename table back from 'new_table_name' to 'old_table_name'
    await queryInterface.renameTable('ClientNotifications', 'ExchangeNotifications');
  }
};
