import { ExpressContext } from 'apollo-server-express';
import { EntityManager } from 'typeorm';

export interface Context extends ExpressContext {
  manager: EntityManager;
}

const createContext =
  (manager: EntityManager) =>
  (ctx: ExpressContext): Context => ({ ...ctx, manager });

export default createContext;
