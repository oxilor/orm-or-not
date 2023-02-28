export type ConnectionCursor = string;

export interface Edge<T> {
  node: T;
  cursor: ConnectionCursor;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: ConnectionCursor | null;
  endCursor: ConnectionCursor | null;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}
