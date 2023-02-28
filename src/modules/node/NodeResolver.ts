import { Arg, Ctx, ID, Query, Resolver } from 'type-graphql';
import { Context } from '../../utils/createContext';
import Base64 from '../../utils/graphql/Base64';
import Node from '../../utils/graphql/Node';

@Resolver()
class NodeResolver {
  @Query(() => Node, { nullable: true })
  async node(
    @Arg('id', () => ID) globalId: string,
    @Ctx() ctx: Context
  ): Promise<Node | null> {
    try {
      const decodedGlobalId = Base64.decode(globalId);
      const [entityName, stringId] = decodedGlobalId.split(':');

      const id = Number(stringId);
      if (!entityName || Number.isNaN(id)) return null;

      const node = await ctx.manager
        .getRepository(entityName)
        .findOneBy({ id });
      if (!node) return null;

      return node as Node;
    } catch {
      return null;
    }
  }
}

export default NodeResolver;
