function defineDocumentAttachment(sequelize, DataTypes) {
  const DocumentAttachment = sequelize.define('DocumentAttachment', {
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attachmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  DocumentAttachment.associate = (models) => {
    DocumentAttachment.belongsTo(models.Document, {
      foreignKey: 'documentId',
      onDelete: 'CASCADE',
    });
    DocumentAttachment.belongsTo(models.Attachment, {
      foreignKey: 'attachmentId',
      onDelete: 'CASCADE',
    });
  };

  return DocumentAttachment;
}

export default defineDocumentAttachment;

