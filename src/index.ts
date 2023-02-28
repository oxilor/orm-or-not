import knex from 'knex';
import 'reflect-metadata';
import knexConfig from '../knexfile';
import createServer from './utils/createServer';

const PORT = 4000;

(async () => {
  const knexInstance = knex(knexConfig);
  try {
    const server = await createServer(knexInstance, PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
    server.once('close', () => knexInstance.destroy());
    process.once('SIGINT', () => server.close());
  } catch (e) {
    await knexInstance.destroy();
  }
})();
