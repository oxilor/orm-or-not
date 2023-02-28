import TestClient from '@os-team/graphql-test-client';
import * as http from 'http';
import knex, { Knex } from 'knex';
import 'reflect-metadata';
import knexConfig from '../../knexfile';
import createSeeder, { Seed } from '../utils/createSeeder';
import createServer from '../utils/createServer';

interface TestContext {
  client: TestClient;
  knex: Knex.Transaction;
  seed: Seed;
  server: http.Server;
}

// eslint-disable-next-line import/prefer-default-export, import/no-mutable-exports
export let ctx: TestContext;

const JEST_WORKER_INDEX = Number(process.env.JEST_WORKER_ID) - 1;
const PORT = 4000 + JEST_WORKER_INDEX;
const URL = `http://localhost:${PORT}/graphql`;

const knexInstance = knex(knexConfig);

afterAll(async () => {
  // Close the connection
  await knexInstance.destroy();
});

beforeEach(async () => {
  // Start a new transaction
  const knexTransaction = await knexInstance.transaction();

  const client = new TestClient({ url: URL });
  const seed = createSeeder(knexTransaction);
  const server = await createServer(knexTransaction, PORT);

  ctx = { client, knex: knexTransaction, seed, server };
});

afterEach(async () => {
  // Rollback the transaction
  await ctx.knex.rollback();
  await ctx.knex.destroy();

  // Close the server
  await new Promise((resolve) => {
    ctx.server.close(resolve);
  });
});
