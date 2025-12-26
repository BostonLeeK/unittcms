import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineDocumentFolder from '../../models/documentFolders.js';
import authMiddleware from '../../middleware/auth.js';
import editableMiddleware from '../../middleware/verifyEditable.js';

export default function (sequelize) {
    const { verifySignedIn } = authMiddleware(sequelize);
    const { verifyProjectDeveloperFromDocumentFolderId } = editableMiddleware(sequelize);
    const DocumentFolder = defineDocumentFolder(sequelize, DataTypes);

    router.delete('/:folderId', verifySignedIn, verifyProjectDeveloperFromDocumentFolderId, async (req, res) => {
        const folderId = req.params.folderId;
        try {
            const folder = await DocumentFolder.findByPk(folderId);
            if (!folder) {
                return res.status(404).send('Document folder not found');
            }
            await folder.destroy();
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
}

