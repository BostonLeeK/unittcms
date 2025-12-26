import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineDocument from '../../models/documents.js';
import authMiddleware from '../../middleware/auth.js';
import editableMiddleware from '../../middleware/verifyEditable.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectDeveloperFromDocumentFolderId } = editableMiddleware(sequelize);
  const Document = defineDocument(sequelize, DataTypes);

  router.post('/', verifySignedIn, verifyProjectDeveloperFromDocumentFolderId, async (req, res) => {
    const folderId = req.query.folderId;

    try {
      const { title, content } = req.body;
      if (!title) {
        return res.status(400).json({
          error: 'Title is required',
        });
      }

      const newDocument = await Document.create({
        title,
        content: content || '',
        folderId,
      });

      res.json(newDocument);
    } catch (error) {
      console.error('Error creating new document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}

