import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineTestPlanTaskStep from '../../../../models/testPlanTaskSteps.js';
import authMiddleware from '../../../../middleware/auth.js';
import editableMiddleware from '../../../../middleware/verifyEditable.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectDeveloperFromTestPlanTaskId } = editableMiddleware(sequelize);
  const TestPlanTaskStep = defineTestPlanTaskStep(sequelize, DataTypes);

  router.post('/', verifySignedIn, verifyProjectDeveloperFromTestPlanTaskId, async (req, res) => {
    try {
      const taskId = req.query.taskId;
      const { description, expectedResult, order } = req.body;
      if (!description || !taskId) {
        return res.status(400).json({ error: 'Description and taskId are required' });
      }

      const newStep = await TestPlanTaskStep.create({
        description,
        expectedResult,
        order: order || 0,
        taskId: taskId,
      });

      res.json(newStep);
    } catch (error) {
      console.error('Error creating new test plan task step:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}




