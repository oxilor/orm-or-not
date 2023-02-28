import { Field, ID, InterfaceType } from 'type-graphql';

@InterfaceType()
abstract class Node {
  @Field(() => ID)
  id!: number;
}

export default Node;
