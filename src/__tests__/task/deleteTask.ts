import Task from '../../entities/Task';
import { ctx } from '../../test-files/setupTests';
import GlobalId from '../../utils/graphql/GlobalId';

const deleteTaskMutation = `
  mutation DeleteTaskMutation($input: DeleteTaskInput!) {
    deleteTask(input: $input)
  }
`;

it('Should delete the existing task', async () => {
  // Seed a task
  const taskData = await ctx.seed(Task, {
    name: 'name',
  });

  const input = {
    id: GlobalId.encode(Task, taskData[0].id),
  };

  // Make the request
  const res = await ctx.client.query({
    query: deleteTaskMutation,
    variables: { input },
  });

  // Test the response
  expect(res.body.errors).toBeUndefined();
  const ok = res.body.data.deleteTask;
  expect(ok).toBeTruthy();

  // Test the database
  const task = await ctx.manager
    .getRepository(Task)
    .findOneBy({ id: taskData[0].id });
  expect(task).toBeNull();
});
