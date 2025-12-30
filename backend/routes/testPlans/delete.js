import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineTestPlan from '../../models/testPlans.js';
import authMiddleware from '../../middleware/auth.js';
import editableMiddleware from '../../middleware/verifyEditable.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectDeveloperFromTestPlanId } = editableMiddleware(sequelize);
  const TestPlan = defineTestPlan(sequelize, DataTypes);

  router.delete('/:planId', verifySignedIn, verifyProjectDeveloperFromTestPlanId, async (req, res) => {
    const planId = req.params.planId;
    try {
      const plan = await TestPlan.findByPk(planId);
      if (!plan) {
        return res.status(404).send('Test Plan not found');
      }
      await plan.destroy();
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}




