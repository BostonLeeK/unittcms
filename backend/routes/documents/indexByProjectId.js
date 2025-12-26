import express from 'express';
const router = express.Router();
import { DataTypes, Op } from 'sequelize';
import defineProject from '../../models/projects.js';
import defineDocumentFolder from '../../models/documentFolders.js';
import defineDocument from '../../models/documents.js';
import authMiddleware from '../../middleware/auth.js';
import visibilityMiddleware from '../../middleware/verifyVisible.js';

export default function (sequelize) {
  const Project = defineProject(sequelize, DataTypes);
  const DocumentFolder = defineDocumentFolder(sequelize, DataTypes);
  const Document = defineDocument(sequelize, DataTypes);
  Project.hasMany(DocumentFolder, { foreignKey: 'projectId' });
  DocumentFolder.hasMany(Document, { foreignKey: 'folderId' });
  DocumentFolder.belongsTo(Project, { foreignKey: 'projectId' });
  Document.belongsTo(DocumentFolder, { foreignKey: 'folderId' });
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectVisibleFromProjectId } = visibilityMiddleware(sequelize);

  router.get(
    '/byproject',
    verifySignedIn,
    verifyProjectVisibleFromProjectId,
    async (req, res) => {
      const { projectId, search } = req.query;

      if (!projectId) {
        return res.status(400).json({ error: 'projectId is required' });
      }

      try {
        const whereClause = {};

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
          where: {
            projectId: projectId,
          },
          attributes: ['id', 'name'],
          required: true,
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
    }
  );

  return router;
}

