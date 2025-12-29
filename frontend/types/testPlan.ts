export type TestPlanTaskStepType = {
  id: number;
  description: string;
  expectedResult: string | null;
  order: number;
  taskId: number;
  createdAt: string;
  updatedAt: string;
};

export type TestPlanTaskType = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  testPlanId: number;
  createdAt: string;
  updatedAt: string;
  TestPlanTaskSteps?: TestPlanTaskStepType[];
};

export type TestPlanType = {
  id: number;
  name: string;
  description: string | null;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  TestPlanTasks?: TestPlanTaskType[];
};

export type TestPlanMessages = {
  testPlans: string;
  testPlan: string;
  newTestPlan: string;
  editTestPlan: string;
  deleteTestPlan: string;
  testPlanName: string;
  testPlanDescription: string;
  close: string;
  create: string;
  update: string;
  pleaseEnter: string;
  delete: string;
  areYouSure: string;
  noTestPlansFound: string;
  task: string;
  tasks: string;
  newTask: string;
  editTask: string;
  deleteTask: string;
  taskTitle: string;
  taskDescription: string;
  step: string;
  steps: string;
  newStep: string;
  editStep: string;
  deleteStep: string;
  stepDescription: string;
  expectedResult: string;
  order: string;
  addStep: string;
  addTask: string;
};


