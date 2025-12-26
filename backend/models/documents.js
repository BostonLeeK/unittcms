function defineDocument(sequelize, DataTypes) {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    folderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'documentFolders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  Document.associate = (models) => {
    Document.belongsTo(models.DocumentFolder, {
      foreignKey: 'folderId',
      onDelete: 'CASCADE',
    });
    Document.belongsToMany(models.Attachment, {
      through: 'documentAttachments',
      foreignKey: 'documentId',
      otherKey: 'attachmentId',
    });
  };

  return Document;
}

export default defineDocument;

