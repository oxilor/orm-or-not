import dotenv from 'dotenv';
import {
  ConnectionOptions,
  createPool as createSlonikPool,
  Interceptor,
  SchemaValidationError,
  SerializableValue,
  stringifyDsn,
  TypeParser
} from 'slonik';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const timestamptzParser: TypeParser = {
  name: 'timestamptz',
  parse: (value: string | null) => (value === null ? value : new Date(value)),
};

const camelCaseInterceptor: Interceptor = {
  transformRow: (executionContext, actualQuery, row) => {
    const { resultParser } = executionContext;

    if (!resultParser) {
      return row;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validationResult = resultParser.safeParse(row) as any;

    if (!validationResult.success) {
      throw new SchemaValidationError(
        actualQuery,
        row as SerializableValue,
        validationResult.error.issues
      );
    }

    return Object.entries(validationResult.data).reduce((acc, [key, value]) => {
      const camelCaseKey = key.replace(/(_[a-zA-Z])/g, (c) =>
        c.slice(1).toUpperCase()
      );
      acc[camelCaseKey] = value;
      return acc;
    }, {});
  },
};

const createPool = (connectionOptions: Partial<ConnectionOptions> = {}) => {
  const connectionUri = stringifyDsn({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    databaseName: process.env.POSTGRES_DATABASE,
    ...connectionOptions,
  });

  return createSlonikPool(connectionUri, {
    typeParsers: [timestamptzParser],
    interceptors: [camelCaseInterceptor],
  });
}

export default createPool;
