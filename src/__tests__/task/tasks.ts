import Task from '../../entities/Task';
import { ctx } from '../../test-files/setupTests';
import GlobalId from '../../utils/graphql/GlobalId';
import { taskFragment } from './task';

const tasksQuery = `
  query TasksQuery($first: Int, $after: String) {
    tasks(first: $first, after: $after) {
      edges {
        node {
          ...TaskFragment
        }
        cursor
      }
    }
  }
  ${taskFragment}
`;

it('Should sort tasks by id in ascending order', async () => {
  // Seed tasks
  const tasksData = await ctx.seed(Task, [
    { name: 'name' },
    { name: 'name2' },
    { name: 'name3' },
  ]);

  // Make the request
  const res = await ctx.client.query({
    query: tasksQuery,
  });

  // Test the response
  expect(res.body.errors).toBeUndefined();
  const { edges } = res.body.data.tasks;
  expect(edges.length).toBe(3);
  expect(GlobalId.decode(Task, edges[0].node.id)).toBe(tasksData[0].id);
  expect(GlobalId.decode(Task, edges[1].node.id)).toBe(tasksData[1].id);
  expect(GlobalId.decode(Task, edges[2].node.id)).toBe(tasksData[2].id);
});

it('Should return tasks after the specified one', async () => {
  // Seed tasks
  const tasksData = await ctx.seed(Task, [
    { name: 'name' },
    { name: 'name2' },
    { name: 'name3' },
  ]);

  // Make the first request
  const firstRes = await ctx.client.query({
    query: tasksQuery,
    variables: {
      first: 1,
    },
  });

  // Test the first response
  expect(firstRes.body.errors).toBeUndefined();
  const firstEdges = firstRes.body.data.tasks.edges;
  expect(firstEdges.length).toBe(1);
  expect(GlobalId.decode(Task, firstEdges[0].node.id)).toBe(tasksData[0].id);

  // Make the second request
  const secondRes = await ctx.client.query({
    query: tasksQuery,
    variables: {
      after: firstEdges[0].cursor,
    },
  });

  // Test the second response
  expect(secondRes.body.errors).toBeUndefined();
  const secondEdges = secondRes.body.data.tasks.edges;
  expect(secondEdges.length).toBe(2);
  expect(GlobalId.decode(Task, secondEdges[0].node.id)).toBe(tasksData[1].id);
  expect(GlobalId.decode(Task, secondEdges[1].node.id)).toBe(tasksData[2].id);
});
