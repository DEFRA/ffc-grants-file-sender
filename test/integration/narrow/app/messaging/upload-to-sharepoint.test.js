afterEach(() => {
  jest.clearAllMocks()
})
describe('Upload to sharepoint tests', () => {
  jest.mock('../../../../../app/services/protective-monitoring-service')
  jest.mock('../../../../../app/config/sharepoint')
  jest.mock('../../../../../app/config/blob-storage')
  jest.mock('@hapi/wreck')
  const wreck = require('@hapi/wreck')
  wreck.put = jest.fn(async (url, data) => { return null })
  const mockSendEvent = jest.fn().mockImplementation(() => {
    console.log('Test: ', 'mockSendEvent mock');
    return { sendEvent: mockSendEvent }
  })
  const appInsights = require('../../../../../app/services/app-insights')
  appInsights.logException = jest.fn((_err, _sessionId) => {})
  jest.mock('ffc-protective-monitoring', () => {
    return {
      PublishEvent: jest.fn().mockImplementation(() => {
        return { sendEvent: mockSendEvent }
      })
    }
  })
  const mockDelete = jest.fn().mockImplementation(() => {
    console.log('test: ', 'deleteFile mock');
    return {
    }
  })
  const mockDownload = jest.fn().mockImplementation(() => {
    console.log('test: ', 'downloadFile mock');
    return {
      buffer: 'buffer',
      blockBlobClient: 'blockBlobClient'
    }
  })
  jest.mock('../../../../../app/services/blob-storage', () => {
    return {
      downloadFile: async () => mockDownload(),
      deleteFile: async () => mockDelete()
    }
  })

  jest.mock('../../../../../app/services/sharepoint', () => {
    return {
      uploadFile: jest.fn(async () => { return null })
    }
  })

  const fileCreatedReceiver = {
    completeMessage: jest.fn(async (message) => { return 'completed' }),
    abandonMessage: jest.fn(async (message) => { return 'its an error' })
  }
  test('Should be defined', () => {
    const uploadToSharepoint = require('../../../../../app/messaging/upload-to-sharepoint')
    expect(uploadToSharepoint).toBeDefined()
  })
  test('Should not throw error', () => {
    const uploadToSharepoint = require('../../../../../app/messaging/upload-to-sharepoint')
    expect(uploadToSharepoint({ body : { filename: 'file-name'}}, fileCreatedReceiver)).toBeDefined()
    expect(appInsights.logException).toHaveBeenCalledTimes(0)
    expect(mockDownload).toHaveBeenCalledTimes(1)
  })
  test('Should throw error', async () => {
    const uploadToSharepoint = require('../../../../../app/messaging/upload-to-sharepoint')
    await expect(uploadToSharepoint('', fileCreatedReceiver)).rejected
    expect(appInsights.logException).toHaveBeenCalledTimes(1)
    expect(mockSendEvent).toHaveBeenCalledTimes(0)
    expect(mockDownload).toHaveBeenCalledTimes(0)
  })
})
