function defineTestPlan(sequelize, DataTypes) {
  const TestPlan = sequelize.define('TestPlan', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'project',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  TestPlan.associate = (models) => {
    TestPlan.belongsTo(models.Project, { foreignKey: 'projectId', onDelete: 'CASCADE' });
    TestPlan.hasMany(models.TestPlanTask, { foreignKey: 'testPlanId', onDelete: 'CASCADE' });
  };

  return TestPlan;
}

export default defineTestPlan;




