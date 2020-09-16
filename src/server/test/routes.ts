import * as Hapi from '@hapi/hapi';
import * as TestHandlers from './handler';
import * as TestSchemas from './schemas';

export default function Route(server: Hapi.Server): void {
  server.route({
    method: 'GET',
    path: '/test',
    handler: TestHandlers.getTest,
  });

  server.route({
    method: 'POST',
    path: '/test',
    handler: TestHandlers.changeTest,
    options: {
      validate: {
        payload: TestSchemas.changeTest,
      },
    },
  });
}
