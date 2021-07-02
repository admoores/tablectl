import * as Joi from '@hapi/joi';
import { join } from 'path';

export const setLights = Joi.compile(Joi.object({
  r: Joi.number().required().min(0).max(255),
  g: Joi.number().required().min(0).max(255),
  b: Joi.number().required().min(0).max(255),
}));

export const setSpecificLights = Joi.compile(Joi.object({
  lights: Joi.array().items(Joi.number()).required(),
  r: Joi.number().required().min(0).max(255),
  g: Joi.number().required().min(0).max(255),
  b: Joi.number().required().min(0).max(255),
}));
