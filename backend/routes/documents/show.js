import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineDocument from '../../models/documents.js';
import defineAttachment from '../../models/attachments.js';
import authMiddleware from '../../middleware/auth.js';
import visibilityMiddleware from '../../middleware/verifyVisible.js';

export default function (sequelize) {
  const Document = defineDocument(sequelize, DataTypes);
  const Attachment = defineAttachment(sequelize, DataTypes);
  Document.belongsToMany(Attachment, { through: 'documentAttachments' });
  Attachment.belongsToMany(Document, { through: 'documentAttachments' });
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectVisibleFromDocumentId } = visibilityMiddleware(sequelize);

  router.get('/:documentId', verifySignedIn, verifyProjectVisibleFromDocumentId, async (req, res) => {
    const documentId = req.params.documentId;

    if (!documentId) {
      return res.status(400).json({ error: 'documentId is required' });
    }

    try {
      const document = await Document.findByPk(documentId, {
        include: [
          {
            model: Attachment,
          },
        ],
      });
      return res.json(document);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}

