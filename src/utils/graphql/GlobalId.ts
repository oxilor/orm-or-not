import { ClassType } from 'type-graphql';
import Base64 from './Base64';

function encode(entityClass: ClassType, id: number): string;
function encode(entity: { id: number }): string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function encode(...args: any[]): string {
  const toGlobalId = (type: string, id: string): string =>
    Base64.encode(`${type}:${id}`);

  if (args.length === 1) {
    if (!args[0].id) throw new Error('ID is required');
    return toGlobalId(args[0].constructor.name, args[0].id);
  }

  return toGlobalId(args[0].name, args[1]);
}

function decode(entityClass: ClassType, globalId: string): number {
  const [type, id] = Base64.decode(globalId).split(':');
  if (!type || !id || entityClass.name !== type)
    throw new Error('Global ID is incorrect');
  return parseInt(id, 10);
}

const GlobalId = {
  encode,
  decode,
};

export default GlobalId;
