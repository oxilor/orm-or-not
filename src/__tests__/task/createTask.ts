import Task from '../../entities/Task';
import { ctx } from '../../test-files/setupTests';
import GlobalId from '../../utils/graphql/GlobalId';
import { taskFragment } from './task';

const createTaskMutation = `
  mutation CreateTaskMutation($input: CreateTaskInput!) {
    createTask(input: $input) {
      ...TaskFragment
    }
  }
  ${taskFragment}
`;

it('Should create a new task', async () => {
  // Seed a task
  const taskData = await ctx.seed('tasks', {
    name: 'name',
  });

  const input = {
    name: taskData[0].name,
  };

  // Make the request
  const res = await ctx.client.query({
    query: createTaskMutation,
    variables: { input },
  });

  // Test the response
  expect(res.body.errors).toBeUndefined();
  const taskRes = res.body.data.createTask;
  expect(taskRes.name).toBe(input.name);

  // Test the database
  const id = GlobalId.decode(Task, taskRes.id);
  const task = await ctx.knex('tasks').where('id', id).select().first();
  expect(task).toBeDefined();
  expect(task?.name).toBe(input.name);
});
