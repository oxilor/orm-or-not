// eslint-disable-next-line max-classes-per-file
import { ClassType, Field, ObjectType } from 'type-graphql';
import { ReturnTypeFuncValue } from 'type-graphql/dist/decorators/types';
import {
  ConnectionCursor,
  Connection as ConnectionType,
  Edge as EdgeType,
} from './connectionTypes';

@ObjectType()
class PageInfo {
  @Field()
  hasNextPage!: boolean;

  @Field()
  hasPreviousPage!: boolean;

  @Field(() => String, { nullable: true })
  startCursor!: ConnectionCursor | null;

  @Field(() => String, { nullable: true })
  endCursor!: ConnectionCursor | null;
}

const createConnectionType = <T>(
  type: ReturnTypeFuncValue,
  name?: string
): ClassType<ConnectionType<T>> => {
  const detectedName = typeof type === 'function' ? type.name : null;
  const typeName = name || detectedName || 'Unknown';

  @ObjectType(`${typeName}Edge`)
  class Edge implements EdgeType<T> {
    @Field(() => type)
    node!: T;

    @Field()
    cursor!: ConnectionCursor;
  }

  @ObjectType(`${typeName}Connection`)
  class Connection implements ConnectionType<T> {
    @Field(() => [Edge])
    edges!: Edge[];

    @Field()
    pageInfo!: PageInfo;
  }

  return Connection;
};

export default createConnectionType;
