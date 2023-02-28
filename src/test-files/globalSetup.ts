import { sql } from 'slonik';
import createPool from '../utils/createPool';
import migrate from '../utils/migrate';

const setup = async () => {
  // Open the connection
  const pool = await createPool();

  // Drop and sync the schema
  await pool.query(sql.unsafe`DROP SCHEMA public CASCADE`);
  await pool.query(sql.unsafe`CREATE SCHEMA public`);
  await migrate();

  // Close the connection
  await pool.end();
};

export default setup;
