import Joi from "joi";

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ["postgres", "postgresql"] })
    .required(),
  LOG_LEVEL: Joi.string()
    .valid("trace", "debug", "info", "warn", "error", "fatal", "silent")
    .default("info"),
  LOG_JSON: Joi.boolean().truthy("true").falsy("false").default(true),
  API_RATE_LIMIT_MAX: Joi.number().integer().positive().default(100),
  API_RATE_LIMIT_TTL_MS: Joi.number().integer().positive().default(60000),
  BETTER_AUTH_SECRET: Joi.string().required(),
  BETTER_AUTH_URL: Joi.string().uri().required(),
});
