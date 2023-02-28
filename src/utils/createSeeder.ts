import { DatabasePool, sql } from 'slonik';

type Data = Record<string, string | number | boolean>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Seed = (table: string, data: Data | Data[]) => Promise<any>;

const typePgTypeMap = {
  string: sql.fragment`text`,
  number: sql.fragment`integer`,
  boolean: sql.fragment`boolean`,
};

const createSeeder =
  (pool: DatabasePool): Seed =>
  async (table, data) => {
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return [];

    const columnNames = Object.keys(arr[0]);
    const columnsFragment = sql.join(
      columnNames.map((key) => sql.identifier([key])),
      sql.fragment`, `
    );

    const tuples = arr.map((item) =>
      columnNames.reduce((acc, col) => {
        acc.push(item[col]);
        return acc;
      }, [])
    );

    const types = columnNames.map((item) => {
      const type = typeof arr[0][item];
      const pgType = typePgTypeMap[type];
      if (!pgType) throw new Error(`The ${type} type is not supported`);
      return pgType;
    });

    const res = await pool.query(sql.unsafe`
      INSERT INTO ${sql.identifier([table])} (${columnsFragment})
      SELECT *
      FROM ${sql.unnest(tuples, types)}
      RETURNING *
    `);

    return res.rows;
  };

export default createSeeder;
