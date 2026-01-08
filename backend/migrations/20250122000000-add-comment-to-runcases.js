export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('runCases', 'comment', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('runCases', 'comment');
}

