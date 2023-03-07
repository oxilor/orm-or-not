import { sql } from 'slonik';
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import Task from '../../entities/Task';
import { Context } from '../../utils/createContext';
import ConnectionArgs from '../../utils/graphql/ConnectionArgs';
import connectionFromArray from '../../utils/graphql/connectionFromArray';
import { Connection } from '../../utils/graphql/connectionTypes';
import createConnectionType from '../../utils/graphql/createConnectionType';
import getPagingParams from '../../utils/graphql/getPagingParams';
import GlobalId from '../../utils/graphql/GlobalId';
import CreateTaskInput from './CreateTaskInput';
import DeleteTaskInput from './DeleteTaskInput';
import UpdateTaskInput from './UpdateTaskInput';

export const TaskConnection = createConnectionType(Task);

@Resolver(() => Task)
class TaskResolver {
  @FieldResolver(() => ID)
  id(@Root() task: Task): string {
    return GlobalId.encode(task);
  }

  @Query(() => Task)
  async task(
    @Arg('id', () => ID) globalId: string,
    @Ctx() ctx: Context
  ): Promise<Task> {
    const id = GlobalId.decode(Task, globalId);
    const task = await ctx.pool.maybeOne(
      sql.unsafe`SELECT * FROM tasks WHERE id = ${id}`
    );
    if (!task) throw new Error('Task is not found');
    return task;
  }

  @Query(() => TaskConnection)
  async tasks(
    @Args() args: ConnectionArgs,
    @Ctx() ctx: Context
  ): Promise<Connection<Task>> {
    const { limit, sortOrder, condition } = getPagingParams(args);

    const whereFragment = condition
      ? sql.fragment`WHERE id ${
          condition.operator === '>' ? sql.fragment`>` : sql.fragment`<`
        } ${condition.params.id}`
      : sql.fragment``;

    const sortOrderFragment =
      sortOrder === 'ASC' ? sql.fragment`ASC` : sql.fragment`DESC`;

    const tasks = await ctx.pool.any(sql.unsafe`
      SELECT * FROM tasks
      ${whereFragment}
      ORDER BY id ${sortOrderFragment}
      LIMIT ${limit + 1}
    `);

    return connectionFromArray({ nodes: tasks as Task[], args, limit });
  }

  @Mutation(() => Task)
  async createTask(
    @Arg('input') input: CreateTaskInput,
    @Ctx() ctx: Context
  ): Promise<Task> {
    const res = await ctx.pool.one(
      sql.unsafe`INSERT INTO tasks (name) VALUES (${input.name}) RETURNING *`
    );
    return res;
  }

  @Mutation(() => Task)
  async updateTask(
    @Arg('input') input: UpdateTaskInput,
    @Ctx() ctx: Context
  ): Promise<Task> {
    const id = GlobalId.decode(Task, input.id);
    const res = await ctx.pool.one(
      sql.unsafe`UPDATE tasks SET name = ${input.name} WHERE id = ${id} RETURNING *`
    );
    return res;
  }

  @Mutation(() => Boolean)
  async deleteTask(
    @Arg('input') input: DeleteTaskInput,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const id = GlobalId.decode(Task, input.id);
    await ctx.pool.query(sql.unsafe`DELETE FROM tasks WHERE id = ${id}`);
    return true;
  }
}

export default TaskResolver;
