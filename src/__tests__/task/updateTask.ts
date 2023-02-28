import Task from '../../entities/Task';
import { ctx } from '../../test-files/setupTests';
import GlobalId from '../../utils/graphql/GlobalId';
import { taskFragment } from './task';

const updateTaskMutation = `
  mutation UpdateTaskMutation($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      ...TaskFragment
    }
  }
  ${taskFragment}
`;

it('Should update the existing task', async () => {
  // Seed a task
  const taskData = await ctx.seed(Task, {
    name: 'name',
  });

  const input = {
    id: GlobalId.encode(Task, taskData[0].id),
    name: 'updatedName',
  };

  // Make the request
  const res = await ctx.client.query({
    query: updateTaskMutation,
    variables: { input },
  });

  // Test the response
  expect(res.body.errors).toBeUndefined();
  const taskRes = res.body.data.updateTask;
  expect(taskRes.name).toBe(input.name);

  // Test the database
  const task = await ctx.manager
    .getRepository(Task)
    .findOneBy({ id: taskData[0].id });
  expect(task).toBeDefined();
  expect(task?.name).toBe(input.name);
});
