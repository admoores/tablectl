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

  server.route({
    method: 'POST',
    path: '/lights/run',
    handler: LightsHandlers.runLights,
    options: {
      validate: {
        payload: LightsSchemas.setLights,
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/lights/specific',
    handler: LightsHandlers.setSpecificLights,
    options: {
      validate: {
        payload: LightsSchemas.setSpecificLights,
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/lights/rainbow',
    handler: LightsHandlers.rainbow,
  });

  server.route({
    method: 'POST',
    path: '/lights/demo',
    handler: LightsHandlers.demo,
  });
}
