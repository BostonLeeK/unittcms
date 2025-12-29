function defineTestPlanTask(sequelize, DataTypes) {
  const TestPlanTask = sequelize.define('TestPlanTask', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    testPlanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'testPlans',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  TestPlanTask.associate = (models) => {
    TestPlanTask.belongsTo(models.TestPlan, { foreignKey: 'testPlanId', onDelete: 'CASCADE' });
    TestPlanTask.hasMany(models.TestPlanTaskStep, { foreignKey: 'taskId', onDelete: 'CASCADE' });
  };

  return TestPlanTask;
}

export default defineTestPlanTask;


