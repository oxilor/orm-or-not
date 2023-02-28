import { Knex } from 'knex';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Seed = (table: string, data: any) => Promise<any>;

const createSeeder =
  (knex: Knex): Seed =>
  (table, data) =>
    knex(table).insert(data).returning('*');

export default createSeeder;
