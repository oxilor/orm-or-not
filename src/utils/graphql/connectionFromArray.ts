import Base64 from './Base64';
import ConnectionArgs from './ConnectionArgs';
import { Connection, Edge } from './connectionTypes';
import isBackwardPagination from './isBackwardPagination';
import Node from './Node';

interface Options<T> {
  /**
   * An array of objects.
   */
  nodes: readonly T[];
  /**
   * The GraphQL connection arguments.
   */
  args: ConnectionArgs;
  /**
   * The size of the page. Used to determine if there are more nodes.
   */
  limit?: number;
  /**
   * Creates a cursor by node.
   */
  cursorCreator?: (node: T) => string;
}

/**
 * Creates the GraphQL Connection.
 * See https://relay.dev/graphql/connections.htm
 */
const connectionFromArray = <T extends Node>(
  options: Options<T>
): Connection<T> => {
  const {
    nodes,
    args,
    limit = options.nodes.length,
    cursorCreator = (node) => Base64.encode(`conn:${node.id}`),
  } = options;

  const lengthDiff = nodes.length - limit;
  const hasMore = lengthDiff > 0;
  const visibleNodes = hasMore ? nodes.slice(0, lengthDiff * -1) : nodes;

  const edges = visibleNodes.map<Edge<T>>((node) => ({
    node,
    cursor: cursorCreator(node),
  }));

  return {
    edges,
    pageInfo: {
      ...(isBackwardPagination(args)
        ? {
            hasNextPage: false,
            hasPreviousPage: hasMore,
          }
        : {
            hasNextPage: hasMore,
            hasPreviousPage: false,
          }),
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    },
  };
};

export default connectionFromArray;
