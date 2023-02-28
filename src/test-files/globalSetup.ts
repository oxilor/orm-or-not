import appDataSource from '../../dataSource';

const setup = async () => {
  // Open the connection
  await appDataSource.initialize();

  // Drop and sync the schema
  await appDataSource.synchronize(true);

  // Close the connection
  await appDataSource.destroy();
};

export default setup;
