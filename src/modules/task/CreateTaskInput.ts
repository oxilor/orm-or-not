import { Field, InputType } from 'type-graphql';

@InputType()
class CreateTaskInput {
  @Field()
  name!: string;
}

export default CreateTaskInput;
