import { Field, ID, InputType } from 'type-graphql';

@InputType()
class DeleteTaskInput {
  @Field(() => ID)
  id!: string;
}

export default DeleteTaskInput;
