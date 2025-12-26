import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineDocument from '../../models/documents.js';
import authMiddleware from '../../middleware/auth.js';
import editableMiddleware from '../../middleware/verifyEditable.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectDeveloperFromDocumentId } = editableMiddleware(sequelize);
  const Document = defineDocument(sequelize, DataTypes);

  router.delete('/:documentId', verifySignedIn, verifyProjectDeveloperFromDocumentId, async (req, res) => {
    const documentId = req.params.documentId;
    try {
      const document = await Document.findByPk(documentId);
      if (!document) {
        return res.status(404).send('Document not found');
      }
      await document.destroy();
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}

