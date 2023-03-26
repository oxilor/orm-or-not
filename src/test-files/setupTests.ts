import TestClient from '@os-team/graphql-test-client';
import * as http from 'http';
import 'reflect-metadata';
import { DatabasePool, sql } from 'slonik';
import createPool from '../utils/createPool';
import createSeeder, { Seed } from '../utils/createSeeder';
import createServer from '../utils/createServer';

interface TestContext {
  pool: DatabasePool;
  seed: Seed;
  server: http.Server;
  client: TestClient;
}

// eslint-disable-next-line import/prefer-default-export, import/no-mutable-exports
export let ctx: TestContext;

const JEST_WORKER_INDEX = Number(process.env.JEST_WORKER_ID) - 1;
const PORT = 4000 + JEST_WORKER_INDEX;
const URL = `http://localhost:${PORT}/graphql`;

beforeAll(async () => {
  const pool = await createPool();
  ctx = {
    pool,
    seed: createSeeder(pool),
    server: await createServer(pool, PORT),
    client: new TestClient({ url: URL }),
  }
});

afterAll(async () => {
  await new Promise((resolve) => {
    ctx.server.close(resolve);
  });
  await ctx.pool.end();
});

afterEach(async () => {
  await ctx.pool.query(sql.unsafe`SELECT truncate_tables()`);
});
