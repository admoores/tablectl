import * as Joi from '@hapi/joi';

export const UpdateValueSchema = Joi.compile(Joi.object({
  value: Joi.string().trim().required(),
}));

export const DisplayConfigSchema = Joi.compile(Joi.object({
  heightSquares: Joi.number().optional(),
  widthSquares: Joi.number().optional(),
  background: Joi.string().trim().required(),
  assets: Joi.array().items(Joi.object({
    file: Joi.string().required(),
    top: Joi.string().required(),
    left: Joi.string().required(),
    height: Joi.string().required(),
    width: Joi.string().required(),
  })).required(),
}));
