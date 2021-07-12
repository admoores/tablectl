import * as Hapi from '@hapi/hapi';
import Joi = require('@hapi/joi');
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
    options: {
      validate: {
        payload: Joi.object({
          brightness: Joi.number().min(0).max(255).required()
        }),
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/lights/randomFade',
    handler: LightsHandlers.randomFade,
    options: {
      validate: {
        payload: Joi.object({
          red: Joi.number().min(0).max(255).required(),
          green: Joi.number().min(0).max(255).required(),
          blue: Joi.number().min(0).max(255).required(),
          hueRange: Joi.number().min(0).max(1).required(),
          variationDistance: Joi.number().min(0).max(144).required(),
        }),
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/lights/demo',
    handler: LightsHandlers.demo,
  });
}
