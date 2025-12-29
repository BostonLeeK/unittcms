function defineTestPlanTaskStep(sequelize, DataTypes) {
    const TestPlanTaskStep = sequelize.define('TestPlanTaskStep', {
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        expectedResult: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        taskId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'testPlanTasks',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    });

    TestPlanTaskStep.associate = (models) => {
        TestPlanTaskStep.belongsTo(models.TestPlanTask, { foreignKey: 'taskId', onDelete: 'CASCADE' });
    };

    return TestPlanTaskStep;
}

export default defineTestPlanTaskStep;


