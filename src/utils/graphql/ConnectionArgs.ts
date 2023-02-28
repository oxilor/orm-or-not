import { ArgsType, Field, Int } from 'type-graphql';
import { ConnectionCursor } from './connectionTypes';

@ArgsType()
class ConnectionArgs {
  @Field(() => Int, { nullable: true })
  first?: number | null;

  @Field(() => String, { nullable: true })
  after?: ConnectionCursor | null;

  @Field(() => Int, { nullable: true })
  last?: number | null;

  @Field(() => String, { nullable: true })
  before?: ConnectionCursor | null;
}

export default ConnectionArgs;
