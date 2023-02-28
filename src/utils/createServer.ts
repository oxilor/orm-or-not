import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { Server } from 'http';
import { DatabasePool } from 'slonik';
import { buildSchema } from 'type-graphql';
import NodeResolver from '../modules/node/NodeResolver';
import TaskResolver from '../modules/task/TaskResolver';
import createContext from './createContext';

const createServer = async (
  pool: DatabasePool,
  port: number,
  callback?: () => void
): Promise<Server> => {
  // Build the schema
  const schema = await buildSchema({
    resolvers: [NodeResolver, TaskResolver],
    validate: { forbidUnknownValues: false },
  });

  // Create a GraphQL server
  const graphqlServer = new ApolloServer({
    schema,
    context: createContext(pool),
  });

  // Create an express server
  const app = express();
  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app });

  return app.listen(port, callback);
};

export default createServer;
