import Joi from 'joi';

export const eventSchema = Joi.object({
  title: Joi.string().required(),
  datetime: Joi.date().iso().greater('now').required(),
  location: Joi.string().required(),
  capacity: Joi.number().integer().min(1).max(1000).required()
});
