import TestClient from '@os-team/graphql-test-client';
import * as http from 'http';
import 'reflect-metadata';
import type { EntityManager, QueryRunner } from 'typeorm';
import appDataSource from '../../dataSource';
import createSeeder, { Seed } from '../utils/createSeeder';
import createServer from '../utils/createServer';

interface TestContext {
  client: TestClient;
  queryRunner: QueryRunner;
  manager: EntityManager;
  seed: Seed;
  server: http.Server;
}

// eslint-disable-next-line import/prefer-default-export, import/no-mutable-exports
export let ctx: TestContext;

const JEST_WORKER_INDEX = Number(process.env.JEST_WORKER_ID) - 1;
const PORT = 4000 + JEST_WORKER_INDEX;
const URL = `http://localhost:${PORT}/graphql`;

beforeAll(async () => {
  // Open the connection
  await appDataSource.initialize();
});

afterAll(async () => {
  // Close the connection
  await appDataSource.destroy();
});

beforeEach(async () => {
  // Start a new transaction
  const queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  const { manager } = queryRunner;

  const client = new TestClient({ url: URL });
  const seed = createSeeder(manager);
  const server = await createServer(manager, PORT);

  ctx = { client, queryRunner, manager, seed, server };
});

afterEach(async () => {
  // Rollback and close the transaction
  await ctx.queryRunner.rollbackTransaction();
  await ctx.queryRunner.release();

  // Close the server
  await new Promise((resolve) => {
    ctx.server.close(resolve);
  });
});
