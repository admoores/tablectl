import * as Joi from '@hapi/joi';

export const changeTest = Joi.compile(Joi.object({
  name: Joi.string().trim().required(),
  count: Joi.number().required(),
}));
