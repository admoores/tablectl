import { Server } from '@hapi/hapi';
import * as Path from 'path';
import * as Inert from '@hapi/inert';
import TestPlugin from './test';

const HTTP_PORT = 3001;
const uiPath = Path.join(process.cwd(), 'dist', 'ui');

// Create HAPI server instances
const server = new Server({
  port: HTTP_PORT,
  routes: {
    validate: {
      failAction: 'error',
    },
  },
});

async function configure(): Promise<void> {
  await server.register([Inert, TestPlugin]);

  server.route({
    method: 'GET',
    path: '/{filename*}',
    handler: {
      directory: {
        path: uiPath,
        index: true,
      },
    },
  });
}

export async function start(): Promise<Server> {
  await configure();
  await server.start();
  console.log(`Server started at: ${server.info.uri}`);
  return server;
}
