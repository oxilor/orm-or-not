import ConnectionArgs from './ConnectionArgs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSpecified = (value: any) => value !== undefined && value !== null;

const isBackwardPagination = (args: ConnectionArgs): boolean =>
  isSpecified(args.last) || isSpecified(args.before);

export default isBackwardPagination;
