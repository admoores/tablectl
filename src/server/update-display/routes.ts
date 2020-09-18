import * as Hapi from '@hapi/hapi';
import * as UpdateHandler from './handler';
import * as UpdateSchemas from './schemas';

export default function Route(server: Hapi.Server): void {
  server.route({
    method: 'GET',
    path: '/display/maps',
    handler: UpdateHandler.getMaps,
  });

  server.route({
    method: 'GET',
    path: '/display',
    handler: UpdateHandler.getDisplayConfig,
  });

  server.route({
    method: 'GET',
    path: '/display/maps/{name}',
    handler: UpdateHandler.getMap,
  });

  server.route({
    method: 'POST',
    path: '/display',
    handler: UpdateHandler.updateDisplayConfig,
    options: {
      validate: {
        payload: UpdateSchemas.DisplayConfigSchema,
      },
    },
  });
}
