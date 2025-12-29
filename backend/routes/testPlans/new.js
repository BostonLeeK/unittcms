import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineTestPlan from '../../models/testPlans.js';
import authMiddleware from '../../middleware/auth.js';
import editableMiddleware from '../../middleware/verifyEditable.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectDeveloperFromProjectId } = editableMiddleware(sequelize);
  const TestPlan = defineTestPlan(sequelize, DataTypes);

  router.post('/', verifySignedIn, verifyProjectDeveloperFromProjectId, async (req, res) => {
    try {
      const projectId = req.query.projectId;
      const { name, description } = req.body;
      if (!name || !projectId) {
        return res.status(400).json({ error: 'Name and projectId are required' });
      }

      const newPlan = await TestPlan.create({
        name,
        description,
        projectId,
      });

      res.json(newPlan);
    } catch (error) {
      console.error('Error creating new test plan:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}


