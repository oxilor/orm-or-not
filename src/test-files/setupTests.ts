import TestClient from '@os-team/graphql-test-client';
import * as http from 'http';
import 'reflect-metadata';
import { DatabasePool, sql } from 'slonik';
import createPool from '../utils/createPool';
import createSeeder, { Seed } from '../utils/createSeeder';
import createServer from '../utils/createServer';

interface TestContext {
  client: TestClient;
  pool: DatabasePool;
  seed: Seed;
  server: http.Server;
}

// eslint-disable-next-line import/prefer-default-export, import/no-mutable-exports
export let ctx: TestContext;

const JEST_WORKER_INDEX = Number(process.env.JEST_WORKER_ID) - 1;
const PORT = 4000 + JEST_WORKER_INDEX;
const URL = `http://localhost:${PORT}/graphql`;

let pool: DatabasePool;

beforeAll(async () => {
  pool = await createPool();
});

afterAll(async () => {
  // Close the connection
  await pool.end();
});

beforeEach(async () => {
  // Start a new transaction
  await pool.query(sql.unsafe`START TRANSACTION`);

  const client = new TestClient({ url: URL });
  const seed = createSeeder(pool);
  const server = await createServer(pool, PORT);

  ctx = { client, pool, seed, server };
});

afterEach(async () => {
  // Rollback the transaction
  await ctx.pool.query(sql.unsafe`ROLLBACK`);

  // Close the server
  await new Promise((resolve) => {
    ctx.server.close(resolve);
  });
});
