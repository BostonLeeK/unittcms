import Config from '@/config/config';
import { logError } from '@/utils/errorHandler';
const apiServer = Config.apiServer;

async function fetchTestPlans(jwt: string, projectId: number) {
  try {
    const url = `${apiServer}/testPlans?projectId=${projectId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error fetching test plans:', error);
  }
}

async function fetchTestPlan(jwt: string, planId: number) {
  const url = `${apiServer}/testPlans/${planId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error fetching test plan', error);
  }
}

async function createTestPlan(jwt: string, name: string, description: string, projectId: string) {
  const newPlanData = {
    name: name,
    description: description,
  };

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(newPlanData),
  };

  const url = `${apiServer}/testPlans?projectId=${projectId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error creating new test plan:', error);
    throw error;
  }
}

async function updateTestPlan(jwt: string, planId: number, name: string, description: string) {
  const updatePlanData = {
    name: name,
    description: description,
  };

  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(updatePlanData),
  };

  const url = `${apiServer}/testPlans/${planId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error updating test plan:', error);
    throw error;
  }
}

async function deleteTestPlan(jwt: string, planId: number) {
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  };

  const url = `${apiServer}/testPlans/${planId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error: unknown) {
    logError('Error deleting test plan:', error);
    throw error;
  }
}

async function createTestPlanTask(jwt: string, planId: string, title: string, description: string, order: number) {
  const newTaskData = {
    title: title,
    description: description,
    order: order,
  };

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(newTaskData),
  };

  const url = `${apiServer}/testPlans/tasks?planId=${planId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error creating new test plan task:', error);
    throw error;
  }
}

async function updateTestPlanTask(jwt: string, taskId: number, title: string, description: string, order: number) {
  const updateTaskData = {
    title: title,
    description: description,
    order: order,
  };

  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(updateTaskData),
  };

  const url = `${apiServer}/testPlans/tasks/${taskId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error updating test plan task:', error);
    throw error;
  }
}

async function deleteTestPlanTask(jwt: string, taskId: number) {
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  };

  const url = `${apiServer}/testPlans/tasks/${taskId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error: unknown) {
    logError('Error deleting test plan task:', error);
    throw error;
  }
}

async function createTestPlanTaskStep(jwt: string, taskId: string, description: string, expectedResult: string, order: number) {
  const newStepData = {
    description: description,
    expectedResult: expectedResult,
    order: order,
  };

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(newStepData),
  };

  const url = `${apiServer}/testPlans/tasks/steps?taskId=${taskId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error creating new test plan task step:', error);
    throw error;
  }
}

async function updateTestPlanTaskStep(jwt: string, stepId: number, description: string, expectedResult: string, order: number) {
  const updateStepData = {
    description: description,
    expectedResult: expectedResult,
    order: order,
  };

  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(updateStepData),
  };

  const url = `${apiServer}/testPlans/tasks/steps/${stepId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error updating test plan task step:', error);
    throw error;
  }
}

async function deleteTestPlanTaskStep(jwt: string, stepId: number) {
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  };

  const url = `${apiServer}/testPlans/tasks/steps/${stepId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error: unknown) {
    logError('Error deleting test plan task step:', error);
    throw error;
  }
}

export {
  fetchTestPlans,
  fetchTestPlan,
  createTestPlan,
  updateTestPlan,
  deleteTestPlan,
  createTestPlanTask,
  updateTestPlanTask,
  deleteTestPlanTask,
  createTestPlanTaskStep,
  updateTestPlanTaskStep,
  deleteTestPlanTaskStep,
};


