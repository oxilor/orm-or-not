import { ExpressContext } from 'apollo-server-express';
import { Knex } from 'knex';

export interface Context extends ExpressContext {
  knex: Knex;
}

const createContext =
  (knex: Knex) =>
  (ctx: ExpressContext): Context => ({ ...ctx, knex });

export default createContext;
