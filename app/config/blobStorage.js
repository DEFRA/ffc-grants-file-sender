const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  connectionStr: Joi.string().when('env', { is: 'production', then: Joi.optional(), otherwise: Joi.required() }),
  storageAccountName: Joi.string().when('env', { is: 'production', then: Joi.required(), otherwise: Joi.optional() }),
  containerName: Joi.string().required()
})

// Build config
const config = {
  env: process.env.NODE_ENV,
  connectionStr: process.env.BLOB_STORAGE_CONNECTION_STRING,
  storageAccountName: process.env.BLOB_STORAGE_ACCOUNT_NAME,
  containerName: process.env.BLOB_STORAGE_CONTAINER_NAME
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
