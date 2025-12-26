import express from 'express';
const router = express.Router();
import { DataTypes, Op } from 'sequelize';
import defineDocument from '../../models/documents.js';
import defineDocumentFolder from '../../models/documentFolders.js';
import authMiddleware from '../../middleware/auth.js';
import visibilityMiddleware from '../../middleware/verifyVisible.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectVisibleFromDocumentFolderId } = visibilityMiddleware(sequelize);
  const Document = defineDocument(sequelize, DataTypes);
  const DocumentFolder = defineDocumentFolder(sequelize, DataTypes);

  Document.belongsTo(DocumentFolder, { foreignKey: 'folderId' });

  async function getAllChildFolderIds(parentFolderId) {
    if (!parentFolderId) {
      return [];
    }

    const folderIds = [parentFolderId];
    const childFolders = await DocumentFolder.findAll({
      where: { parentFolderId: parentFolderId },
    });

    for (const child of childFolders) {
      const nestedIds = await getAllChildFolderIds(child.id);
      folderIds.push(...nestedIds);
    }

    return folderIds;
  }

  router.get('/', verifySignedIn, verifyProjectVisibleFromDocumentFolderId, async (req, res) => {
    const { folderId, search } = req.query;

    if (!folderId) {
      return res.status(400).json({ error: 'folderId is required' });
    }

    try {
      const allFolderIds = await getAllChildFolderIds(Number(folderId));
      const whereClause = {
        folderId: { [Op.in]: allFolderIds },
      };

      if (search) {
        const searchTerm = search.trim();

        if (searchTerm.length > 100) {
          return res.status(400).json({ error: 'too long search param' });
        }

        if (searchTerm.length >= 1) {
          whereClause[Op.or] = [
            { title: { [Op.like]: `%${searchTerm}%` } },
            { content: { [Op.like]: `%${searchTerm}%` } },
          ];
        }
      }

      const folderInclude = {
        model: DocumentFolder,
        attributes: ['id', 'name'],
        required: false,
      };

      const documents = await Document.findAll({
        where: whereClause,
        include: [folderInclude],
      });
      res.json(documents);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}

