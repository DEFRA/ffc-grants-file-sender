
const appInsight = require('../../../../../app/services/app-insights')
const config = require('../../../../../app/config/server')
const exp = require('constants')

const startSpy = jest.fn()
const appInsightSetupSpy = jest.spyOn(require('applicationinsights'), 'setup').mockReturnValue({
  start: startSpy()
})

describe('get appInsight setup defined', () => {
  test('Should be defined', () => {
    expect(appInsight).toBeDefined()
  })
  test('With now key Should not to throw', () => {
    expect(appInsight.setup()).toBe(undefined)
  })
  test('logException should run', () => {
    expect(appInsight.logException(new Error(''), '12341234')).toBe(undefined)
  })
  test('logException should not throw error', () => {
    expect(appInsight.logException(null, null)).toBe(undefined)
  })
  it('TEST: setup is called without config present', () => {
    appInsight.setup()
    expect(appInsightSetupSpy).toHaveBeenCalledTimes(0)
  })
  it('TEST: setup is called with correct config present', () => {
    jest.mock('../../../../../app/config/server', () => {
      return {
        appInsights: {
          key: 'key',
          role: 'role'
        }
      }
    })
    appInsight.setup()
    expect(appInsightSetupSpy).toHaveBeenCalledTimes(0)
  })
})
