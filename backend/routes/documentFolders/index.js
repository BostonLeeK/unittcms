import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineDocumentFolder from '../../models/documentFolders.js';
import authMiddleware from '../../middleware/auth.js';
import visibilityMiddleware from '../../middleware/verifyVisible.js';

export default function (sequelize) {
    const { verifySignedIn } = authMiddleware(sequelize);
    const { verifyProjectVisibleFromProjectId } = visibilityMiddleware(sequelize);
    const DocumentFolder = defineDocumentFolder(sequelize, DataTypes);

    router.get('/', verifySignedIn, verifyProjectVisibleFromProjectId, async (req, res) => {
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ error: 'projectId is required' });
        }

        try {
            const folders = await DocumentFolder.findAll({
                where: {
                    projectId: projectId,
                },
            });
            res.json(folders);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
}

