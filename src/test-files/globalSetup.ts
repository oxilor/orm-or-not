import knex from 'knex';
import knexConfig from '../../knexfile';

const setup = async () => {
  // Open the connection
  const knexInstance = knex(knexConfig);

  // Drop and sync the schema
  await knexInstance.schema.dropSchema('public', true);
  await knexInstance.schema.createSchema('public');
  await knexInstance.migrate.latest();

  // Close the connection
  await knexInstance.destroy();
};

export default setup;
