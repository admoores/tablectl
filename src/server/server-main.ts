import {
  Server,
  Request,
  ResponseToolkit,
  ResponseObject,
} from '@hapi/hapi';
import { Boom } from '@hapi/boom';
import * as Path from 'path';
import * as Inert from '@hapi/inert';
import TestPlugin from './test';

const HTTP_PORT = 3001;
const API_VERSION = 'v1';
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
  await server.register([Inert]);

  const registerOptions = { routes: { prefix: `/${API_VERSION}` } };
  await server.register([
    TestPlugin,
  ], registerOptions);

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

  // Enable html5 path mode by returning index for all unknown routes
  server.ext('onPreResponse', (request: Request, h: ResponseToolkit) => {
    let statusCode: number;

    if ((request.response as Boom).isBoom) {
      const boomResponse = request.response as Boom;

      statusCode = boomResponse.output.statusCode;
    } else {
      const response = request.response as ResponseObject;

      // All good responses - short circuit
      if (response.statusCode < 400) {
        return h.continue;
      }

      statusCode = response.statusCode;
    }

    // If the requested page is not an API route and is not requesting a file
    // or is requesting a htm(l) file, return HTML responses
    if (request.url.pathname.indexOf(`/${API_VERSION}/`) === -1
      && (request.url.pathname.indexOf('.') === -1
        || request.url.pathname.search(/\.htm(l?)$/) !== -1)) {
      if (statusCode === 403) {
        return h.file(Path.join(uiPath, 'static', 'forbidden.html')).code(403);
      }

      // Return the index page for any non-file request or requests for .htm(l) files
      if (statusCode === 404) {
        return h.file(Path.join(uiPath, 'index.html'));
      }

      if (statusCode >= 500) {
        return h.file(Path.join(uiPath, 'static', 'server-error.html')).code(500);
      }
    }

    return h.continue;
  });
}

export async function start(): Promise<Server> {
  await configure();
  await server.start();
  console.log(`Server started at: ${server.info.uri}`);
  return server;
}
