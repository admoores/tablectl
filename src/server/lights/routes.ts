import * as Hapi from '@hapi/hapi';
import * as LightsHandlers from './handler';
import * as LightsSchemas from './schemas';

export default function Route(server: Hapi.Server): void {
  server.route({
    method: 'POST',
    path: '/lights',
    handler: LightsHandlers.setLights,
    options: {
      validate: {
        payload: LightsSchemas.setLights,
      },
    },
  });
}
