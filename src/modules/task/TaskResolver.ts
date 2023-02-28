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
    const task = await ctx.manager.getRepository(Task).findOneBy({ id });
    if (!task) throw new Error('Task is not found');
    return task;
  }

  @Query(() => TaskConnection)
  async tasks(
    @Args() args: ConnectionArgs,
    @Ctx() ctx: Context
  ): Promise<Connection<Task>> {
    const { limit, sortOrder, condition } = getPagingParams(args);

    const query = ctx.manager.getRepository(Task).createQueryBuilder();

    if (condition) {
      query.where(`id ${condition.operator} :id`, {
        id: condition.params.id,
      });
    }

    const tasks = await query
      .orderBy('id', sortOrder)
      .limit(limit + 1)
      .getMany();

    return connectionFromArray({ nodes: tasks, args, limit });
  }

  @Mutation(() => Task)
  async createTask(
    @Arg('input') input: CreateTaskInput,
    @Ctx() ctx: Context
  ): Promise<Task> {
    const task = new Task();
    task.name = input.name;
    return ctx.manager.save(task);
  }

  @Mutation(() => Task)
  async updateTask(
    @Arg('input') input: UpdateTaskInput,
    @Ctx() ctx: Context
  ): Promise<Task> {
    const task = await this.task(input.id, ctx);
    task.name = input.name;
    return ctx.manager.save(task);
  }

  @Mutation(() => Boolean)
  async deleteTask(
    @Arg('input') input: DeleteTaskInput,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const id = GlobalId.decode(Task, input.id);
    await ctx.manager.getRepository(Task).delete({ id });
    return true;
  }
}

export default TaskResolver;
