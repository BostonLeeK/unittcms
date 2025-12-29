import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineTestPlan from '../../models/testPlans.js';
import defineTestPlanTask from '../../models/testPlanTasks.js';
import defineTestPlanTaskStep from '../../models/testPlanTaskSteps.js';
import authMiddleware from '../../middleware/auth.js';
import visibilityMiddleware from '../../middleware/verifyVisible.js';

export default function (sequelize) {
  const TestPlan = defineTestPlan(sequelize, DataTypes);
  const TestPlanTask = defineTestPlanTask(sequelize, DataTypes);
  const TestPlanTaskStep = defineTestPlanTaskStep(sequelize, DataTypes);

  TestPlan.hasMany(TestPlanTask, { foreignKey: 'testPlanId' });
  TestPlanTask.hasMany(TestPlanTaskStep, { foreignKey: 'taskId' });
  TestPlanTask.belongsTo(TestPlan, { foreignKey: 'testPlanId' });
  TestPlanTaskStep.belongsTo(TestPlanTask, { foreignKey: 'taskId' });

  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectVisibleFromTestPlanId } = visibilityMiddleware(sequelize);

  router.get('/:planId', verifySignedIn, verifyProjectVisibleFromTestPlanId, async (req, res) => {
    const planId = req.params.planId;

    if (!planId) {
      return res.status(400).json({ error: 'planId is required' });
    }

    try {
      const plan = await TestPlan.findByPk(planId, {
        include: [
          {
            model: TestPlanTask,
            include: [
              {
                model: TestPlanTaskStep,
                order: [['order', 'ASC']],
              },
            ],
            order: [['order', 'ASC']],
          },
        ],
      });
      return res.json(plan);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}


