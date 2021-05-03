
describe('Upload to sharepoint tests', () => {
  jest.mock('../../../../../app/services/protective-monitoring-service')
  jest.mock('@pnp/nodejs-commonjs')
  jest.mock('@azure/storage-blob')
  jest.mock('../../../../../app/config/sharepoint')
  jest.mock('../../../../../app/config/blobStorage')
  jest.mock('@hapi/wreck')
  const client = require('@pnp/nodejs-commonjs')
  const wreck = require('@hapi/wreck')
  wreck.put = jest.fn(async (url, data) => { return null })
  client.AdalFetchClient.mockImplementation((tenantId, clientId, clientSecret) => {
    return {
      client: jest.fn().mockReturnValue({
        acquireToken: jest.fn().mockReturnValue({
          accessToken: 'accessTokenVal'
        })
      })
    }
  })
  test('Should be defined', () => {
    const uploadToSharepoint = require('../../../../../app/messaging/upload-to-sharepoint')
    expect(uploadToSharepoint).toBeDefined()
  })

  test('Should not throw error', () => {
    const fileCreatedReceiver = {
      completeMessage: jest.fn(async (message) => { return null }),
      abandonMessage: jest.fn(async (message) => { return null })
    }
    const uploadToSharepoint = require('../../../../../app/messaging/upload-to-sharepoint')
    expect(uploadToSharepoint('', fileCreatedReceiver)).toBeDefined()
  })
})
