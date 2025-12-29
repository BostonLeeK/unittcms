import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineTestPlan from '../../models/testPlans.js';
import authMiddleware from '../../middleware/auth.js';
import visibilityMiddleware from '../../middleware/verifyVisible.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectVisibleFromProjectId } = visibilityMiddleware(sequelize);
  const TestPlan = defineTestPlan(sequelize, DataTypes);

  router.get('/', verifySignedIn, verifyProjectVisibleFromProjectId, async (req, res) => {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    try {
      const plans = await TestPlan.findAll({
        where: {
          projectId: projectId,
        },
        order: [['createdAt', 'DESC']],
      });
      res.json(plans);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}


