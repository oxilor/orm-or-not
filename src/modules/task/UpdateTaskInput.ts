import { Field, ID, InputType } from 'type-graphql';
import CreateTaskInput from './CreateTaskInput';

@InputType()
class UpdateTaskInput extends CreateTaskInput {
  @Field(() => ID)
  id!: string;
}

export default UpdateTaskInput;
