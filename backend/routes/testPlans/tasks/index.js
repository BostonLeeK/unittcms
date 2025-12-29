import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineTestPlanTask from '../../../models/testPlanTasks.js';
import authMiddleware from '../../../middleware/auth.js';
import visibilityMiddleware from '../../../middleware/verifyVisible.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectVisibleFromTestPlanId } = visibilityMiddleware(sequelize);
  const TestPlanTask = defineTestPlanTask(sequelize, DataTypes);

  router.get('/', verifySignedIn, verifyProjectVisibleFromTestPlanId, async (req, res) => {
    const { planId } = req.query;

    if (!planId) {
      return res.status(400).json({ error: 'planId is required' });
    }

    try {
      const tasks = await TestPlanTask.findAll({
        where: {
          testPlanId: planId,
        },
        order: [['order', 'ASC']],
      });
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}
