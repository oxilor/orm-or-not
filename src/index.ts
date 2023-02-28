import 'reflect-metadata';
import appDataSource from '../dataSource';
import createServer from './utils/createServer';

const PORT = 4000;

(async () => {
  try {
    const server = await createServer(appDataSource.manager, PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
    server.once('close', () => appDataSource.destroy());
    process.once('SIGINT', () => server.close());
  } catch (e) {
    await appDataSource.destroy();
  }
})();
