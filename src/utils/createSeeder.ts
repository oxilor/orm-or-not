import { EntityManager } from 'typeorm';
import { ObjectType } from 'typeorm/common/ObjectType';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export type Seed = <Entity>(
  entity: ObjectType<Entity>,
  data: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[]
) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const createSeeder =
  (manager: EntityManager): Seed =>
  async (entity, data) => {
    const res = await manager
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(data)
      .returning('*')
      .execute();
    return res.raw;
  };

export default createSeeder;
