import * as Joi from '@hapi/joi';
import { join } from 'path';

export const setLights = Joi.compile(Joi.object({
  red: Joi.number().required,
  green: Joi.number().required(),
  blue: Joi.number().required,
}));
