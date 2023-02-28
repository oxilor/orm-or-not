import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Node from '../utils/graphql/Node';

@ObjectType({ implements: Node })
@Entity('tasks')
class Task extends BaseEntity implements Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;

  @Field()
  @Column()
  public name!: string;
}

export default Task;
