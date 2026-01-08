import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineTestPlanTask from '../../../models/testPlanTasks.js';
import authMiddleware from '../../../middleware/auth.js';
import editableMiddleware from '../../../middleware/verifyEditable.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectDeveloperFromTestPlanId } = editableMiddleware(sequelize);
  const TestPlanTask = defineTestPlanTask(sequelize, DataTypes);

  router.post('/', verifySignedIn, verifyProjectDeveloperFromTestPlanId, async (req, res) => {
    try {
      const planId = req.query.planId;
      const { title, description, order } = req.body;
      if (!title || !planId) {
        return res.status(400).json({ error: 'Title and planId are required' });
      }

      const newTask = await TestPlanTask.create({
        title,
        description,
        order: order || 0,
        testPlanId: planId,
      });

      res.json(newTask);
    } catch (error) {
      console.error('Error creating new test plan task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}




