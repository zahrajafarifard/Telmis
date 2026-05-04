module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('clients', 'resume_status', {
    //   type: Sequelize.ENUM('pending', 'accepted', 'refused'),
    //   allowNull: false,
    //   defaultValue: 'pending',
    // });
    // await queryInterface.addColumn('clients', 'resume_reviewed_at', {
    //   type: Sequelize.DATE,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn('clients', 'resume_reviewed_by', {
    //   type: Sequelize.INTEGER, // Change to UUID if needed
    //   allowNull: true,
    //   references: {
    //     model: 'admins', // Adjust if your admin table has a different name
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // });
    // await queryInterface.addColumn('clients', 'resume_feedback', {
    //   type: Sequelize.TEXT,
    //   allowNull: true,
    // });
  },

  // down: async (queryInterface) => {
  //   await queryInterface.removeColumn('clients', 'resume_status');
  //   // await queryInterface.removeColumn('clients', 'resume_reviewed_at');
  //   // await queryInterface.removeColumn('clients', 'resume_reviewed_by');
  //   // await queryInterface.removeColumn('clients', 'resume_feedback');
  // },
};
