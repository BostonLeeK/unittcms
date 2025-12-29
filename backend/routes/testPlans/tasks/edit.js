import express from 'express';
const router = express.Router();
import { DataTypes } from 'sequelize';
import defineTestPlanTask from '../../../models/testPlanTasks.js';
import authMiddleware from '../../../middleware/auth.js';
import editableMiddleware from '../../../middleware/verifyEditable.js';

export default function (sequelize) {
  const { verifySignedIn } = authMiddleware(sequelize);
  const { verifyProjectDeveloperFromTestPlanTaskId } = editableMiddleware(sequelize);
  const TestPlanTask = defineTestPlanTask(sequelize, DataTypes);

  router.put('/:taskId', verifySignedIn, verifyProjectDeveloperFromTestPlanTaskId, async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, order } = req.body;
    try {
      const task = await TestPlanTask.findByPk(taskId);
      if (!task) {
        return res.status(404).send('Test Plan Task not found');
      }
      await task.update({
        title,
        description,
        order,
      });
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
}


