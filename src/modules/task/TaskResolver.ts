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
    const task = await ctx.knex('tasks').where('id', id).select().first();
    if (!task) throw new Error('Task is not found');
    return task;
  }

  @Query(() => TaskConnection)
  async tasks(
    @Args() args: ConnectionArgs,
    @Ctx() ctx: Context
  ): Promise<Connection<Task>> {
    const { limit, sortOrder, condition } = getPagingParams(args);

    const query = ctx.knex('tasks');

    if (condition) {
      query.where('id', condition.operator, condition.params.id);
    }

    const tasks = await query.orderBy('id', sortOrder).limit(limit + 1);

    return connectionFromArray({ nodes: tasks, args, limit });
  }

  @Mutation(() => Task)
  async createTask(
    @Arg('input') input: CreateTaskInput,
    @Ctx() ctx: Context
  ): Promise<Task> {
    const res = await ctx
      .knex('tasks')
      .insert({ name: input.name })
      .returning('*');
    return res[0];
  }

  @Mutation(() => Task)
  async updateTask(
    @Arg('input') input: UpdateTaskInput,
    @Ctx() ctx: Context
  ): Promise<Task> {
    const id = GlobalId.decode(Task, input.id);
    const res = await ctx
      .knex('tasks')
      .where('id', id)
      .update({ name: input.name })
      .returning('*');
    return res[0];
  }

  @Mutation(() => Boolean)
  async deleteTask(
    @Arg('input') input: DeleteTaskInput,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const id = GlobalId.decode(Task, input.id);
    await ctx.knex('tasks').where('id', id).delete();
    return true;
  }
}

export default TaskResolver;
