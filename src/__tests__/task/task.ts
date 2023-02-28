import Task from '../../entities/Task';
import { ctx } from '../../test-files/setupTests';
import GlobalId from '../../utils/graphql/GlobalId';

// eslint-disable-next-line jest/no-export,import/prefer-default-export
export const taskFragment = `
  fragment TaskFragment on Task {
    id
    name
    createdAt
  }
`;

const taskQuery = `
  query TaskQuery($id: ID!) {
    task(id: $id) {
      ...TaskFragment
    }
  }
  ${taskFragment}
`;

it('Should return the existing task', async () => {
  // Seed a task
  const taskData = await ctx.seed(Task, {
    name: 'name',
  });

  // Make the request
  const res = await ctx.client.query({
    query: taskQuery,
    variables: {
      id: GlobalId.encode(Task, taskData[0].id),
    },
  });

  // Test the response
  expect(res.body.errors).toBeUndefined();
  const taskRes = res.body.data.task;
  expect(GlobalId.decode(Task, taskRes.id)).toBe(taskData[0].id);
  expect(taskRes.name).toBe(taskData[0].name);
  expect(taskRes.createdAt).toBeDefined();
});
