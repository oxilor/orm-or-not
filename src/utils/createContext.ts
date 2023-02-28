import { ExpressContext } from 'apollo-server-express';
import { DatabasePool } from 'slonik';

export interface Context extends ExpressContext {
  pool: DatabasePool;
}

const createContext =
  (pool: DatabasePool) =>
  (ctx: ExpressContext): Context => ({ ...ctx, pool });

export default createContext;
