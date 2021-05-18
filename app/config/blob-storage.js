const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  connectionStr: Joi.string().when('env', { is: 'production', then: Joi.allow('').optional(), otherwise: Joi.required() }),
  storageAccountName: Joi.string().when('env', { is: 'production', then: Joi.required(), otherwise: Joi.allow('').optional() }),
  containerName: Joi.string().required(),
  useConnectionStr: Joi.boolean().default(false)
})

// Build config
const config = {
  env: process.env.NODE_ENV,
  connectionStr: process.env.BLOB_STORAGE_CONNECTION_STRING,
  storageAccountName: process.env.BLOB_STORAGE_ACCOUNT_NAME,
  containerName: process.env.BLOB_STORAGE_CONTAINER_NAME,
  useConnectionStr: process.env.USE_BLOB_STORAGE_CONNECTION_STRING
}

console.log(config)

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
