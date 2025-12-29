export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('testPlanTaskSteps', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    expectedResult: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    taskId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'testPlanTasks',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('testPlanTaskSteps');
}


