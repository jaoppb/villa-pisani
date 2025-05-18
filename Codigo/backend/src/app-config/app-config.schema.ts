import * as Joi from 'joi';

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test')
		.default('development'),
	API_LOG_LEVEL: Joi.string().default('level=info'),
	API_PASSWORD_KEY_LENGTH: Joi.number().default(32),
	API_PASSWORD_SALT_LENGTH: Joi.number().default(8),
	API_JWT_SECRET: Joi.string().required(),
	API_ADMIN_EMAIL: Joi.string().email().required(),
	API_ADMIN_PASSWORD: Joi.string().required(),
	API_STRIPE_SECRET_KEY: Joi.string().required(),
	API_ADDRESS_COUNTRY: Joi.string().default('BR'),
	API_ADDRESS_CITY: Joi.string().required(),
	API_ADDRESS_STATE: Joi.string().required(),
	API_ADDRESS_CEP: Joi.string().required(),
	API_ADDRESS_STREET: Joi.string().required(),
	API_ADDRESS_NUMBER: Joi.number().required(),
	API_FILE_SERVING_PATH: Joi.string().default('/app/files'),
	DB_TYPE: Joi.string().required(),
	DB_NAME: Joi.string().required(),
	DB_HOST: Joi.string().required(),
	DB_INTERNAL_PORT: Joi.number().min(0).max(65535).required(),
	DB_USER: Joi.string().required(),
	DB_PASS: Joi.string().required(),
});
export default validationSchema;
