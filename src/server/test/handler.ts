import { Request } from '@hapi/hapi';
import { TestObject } from './types';

export async function getTest(): Promise<Array<TestObject>> {
  return Promise.resolve([
    { name: 'Name 1', count: 1 },
    { name: 'Name 2', count: 2 },
  ]);
}

export async function changeTest(req: Request): Promise<TestObject> {
  return Promise.resolve(req.payload as TestObject);
}
