import Joi from 'joi';

export const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().alphanum().min(8).max(12).required(),
});

export const siginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().alphanum().min(8).max(12).required(),
});

export const duckSchema = Joi.object({
    name: Joi.string().required(),
    imgUrl: Joi.string().uri().required(),
    quote: Joi.string().default('Count on me to become bug free!'),
    owner: Joi.string(),
});
