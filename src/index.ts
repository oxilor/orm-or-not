import 'reflect-metadata';
import createPool from './utils/createPool';
import createServer from './utils/createServer';

const PORT = 4000;

(async () => {
  const pool = await createPool();
  try {
    const server = await createServer(pool, PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
    server.once('close', () => pool.end());
    process.once('SIGINT', () => server.close());
  } catch (e) {
    await pool.end();
  }
})();
