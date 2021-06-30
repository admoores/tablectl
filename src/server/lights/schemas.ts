import * as Joi from '@hapi/joi';
import { join } from 'path';

export const setLights = Joi.compile(Joi.object({
  red: Joi.number().required().min(0).max(255),
  green: Joi.number().required().min(0).max(255),
  blue: Joi.number().required().min(0).max(255),
}));

export const setSpecificLights = Joi.compile(Joi.object({
  lights: Joi.array().items(Joi.number()).required(),
  red: Joi.number().required().min(0).max(255),
  green: Joi.number().required().min(0).max(255),
  blue: Joi.number().required().min(0).max(255),
}));
