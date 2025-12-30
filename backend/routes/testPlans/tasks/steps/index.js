import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineTestPlanTaskStep from '../../../../models/testPlanTaskSteps.js';
import authMiddleware from '../../../../middleware/auth.js';
import visibilityMiddleware from '../../../../middleware/verifyVisible.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectVisibleFromTestPlanTaskId } = visibilityMiddleware(sequelize);
  const TestPlanTaskStep = defineTestPlanTaskStep(sequelize, DataTypes);

  router.get('/', verifySignedIn, verifyProjectVisibleFromTestPlanTaskId, async (req, res) => {
    const { taskId } = req.query;

    if (!taskId) {
      return res.status(400).json({ error: 'taskId is required' });
    }

    try {
      const steps = await TestPlanTaskStep.findAll({
        where: {
          taskId: taskId,
        },
        order: [['order', 'ASC']],
      });
      res.json(steps);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}




