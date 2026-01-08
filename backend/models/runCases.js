function defineRunCase(sequelize, DataTypes) {
  const RunCase = sequelize.define('RunCase', {
    runId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    caseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  RunCase.associate = (models) => {
    RunCase.belongsTo(models.Run, {
      foreignKey: 'runId',
      onDelete: 'CASCADE',
    });
    RunCase.belongsTo(models.Case, {
      foreignKey: 'caseId',
      onDelete: 'CASCADE',
    });
  };

  return RunCase;
}

export default defineRunCase;
