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

  router.put('/:stepId', verifySignedIn, verifyProjectDeveloperFromTestPlanTaskId, async (req, res) => {
    const stepId = req.params.stepId;
    const { description, expectedResult, order } = req.body;
    try {
      const step = await TestPlanTaskStep.findByPk(stepId);
      if (!step) {
        return res.status(404).send('Test Plan Task Step not found');
      }
      await step.update({
        description,
        expectedResult,
        order,
      });
      res.json(step);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}




