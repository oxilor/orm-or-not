import { Field, ID, ObjectType } from 'type-graphql';
import Node from '../utils/graphql/Node';

@ObjectType({ implements: Node })
class Task implements Node {
  @Field(() => ID)
  public id!: number;

  @Field()
  public createdAt!: Date;

  @Field()
  public name!: string;
}

export default Task;
