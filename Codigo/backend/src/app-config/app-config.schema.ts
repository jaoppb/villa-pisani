import * as Joi from 'joi';

export const validationSchema = Joi.object({
	API_LOG_LEVEL: Joi.string().default('level=info'),
	API_PASSWORD_KEY_LENGTH: Joi.number().default(32),
	API_PASSWORD_SALT_LENGTH: Joi.number().default(8),
	API_JWT_SECRET: Joi.string().required(),
	DB_TYPE: Joi.string().required(),
	DB_NAME: Joi.string().required(),
	DB_HOST: Joi.string().required(),
	DB_INTERNAL_PORT: Joi.number().min(0).max(65535).required(),
	DB_USER: Joi.string().required(),
	DB_PASS: Joi.string().required(),
});
export default validationSchema;
