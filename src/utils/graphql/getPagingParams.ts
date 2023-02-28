import Base64 from './Base64';
import ConnectionArgs from './ConnectionArgs';
import { ConnectionCursor } from './connectionTypes';
import isBackwardPagination from './isBackwardPagination';

export interface Condition<Params> {
  operator: '>' | '<';
  params: Params;
}

export interface PagingParams<Params> {
  limit: number;
  sortOrder: 'ASC' | 'DESC';
  condition?: Condition<Params>;
}

interface Options<Params> {
  reverseOrder?: boolean;
  defaultLimit?: number;
  paramsCreator?: (cursor: string) => Params;
}

const getId = (cursor: ConnectionCursor) => {
  const [, id] = Base64.decode(cursor).split(':');
  return Number(id);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPagingParams = <Params = { id: number }>(
  args: ConnectionArgs,
  options: Options<Params> = {}
): PagingParams<Params> => {
  const { first, after, last, before } = args;
  const {
    reverseOrder = false,
    defaultLimit = 100,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    paramsCreator = (cursor): Params => ({ id: getId(cursor) }),
  } = options;

  // The backward pagination
  if (isBackwardPagination(args)) {
    return {
      limit: last || defaultLimit,
      sortOrder: reverseOrder ? 'ASC' : 'DESC',
      condition: before
        ? { operator: reverseOrder ? '>' : '<', params: paramsCreator(before) }
        : undefined,
    };
  }

  // The forward pagination
  return {
    limit: first || defaultLimit,
    sortOrder: reverseOrder ? 'DESC' : 'ASC',
    condition: after
      ? { operator: reverseOrder ? '<' : '>', params: paramsCreator(after) }
      : undefined,
  };
};

export default getPagingParams;
