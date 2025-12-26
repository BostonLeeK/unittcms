function defineDocumentFolder(sequelize, DataTypes) {
  const DocumentFolder = sequelize.define('DocumentFolder', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parentFolderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'documentFolders',
        key: 'id',
      },
      onDelete: 'CASCADE',
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

  DocumentFolder.associate = (models) => {
    DocumentFolder.belongsTo(models.Project, { foreignKey: 'projectId', onDelete: 'CASCADE' });
    DocumentFolder.belongsTo(models.DocumentFolder, { foreignKey: 'parentFolderId', onDelete: 'CASCADE' });
    DocumentFolder.hasMany(models.Document, { foreignKey: 'folderId' });
  };

  return DocumentFolder;
}

export default defineDocumentFolder;

