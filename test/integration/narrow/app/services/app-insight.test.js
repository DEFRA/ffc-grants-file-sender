
const appInsight = require('../../../../../app/services/app-insights')

jest.mock('../../../../../app/config/server', () => {
  return {
    appInsights: {
      key: 'key',
      role: 'role'
    }
  }
})

jest.mock('applicationinsights', () => {
  return {
    setup: jest.fn().mockReturnValue({
      start: jest.fn(),
    }),
    defaultClient: {
      context: {
        keys: {
          cloudRole: 'cloudRole'
        },
        tags: {
          cloudRole: 'cloudRole'
        }
      },
      trackException: jest.fn()
    }
  }
})

describe('get appInsight setup defined', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
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

  it('TEST: setup is called with config present', () => {
    const trackExceptionSpy = jest.fn();
    const applicationinsightsSetupSpy = jest.spyOn(require('applicationinsights'), 'setup').mockReturnValue({
      start: jest.fn().mockImplementation(() => {
        return {
          context: {
            keys: {
              cloudRole: 'cloudRole'
              },
            tags: {
              cloudRole: 'cloudRole'
            }
          },
          trackException: trackExceptionSpy
        }
      }),
    });
    appInsight.setup()
    expect(applicationinsightsSetupSpy).toHaveBeenCalledTimes(1)
    expect(trackExceptionSpy).toHaveBeenCalledTimes(0)

  })
  it('TEST: setup is called without config present', () => {
    const applicationinsightsSpy = jest.spyOn(require('applicationinsights'), 'setup');
    const defaultClientTrackExceptionSpy = jest.spyOn(require('applicationinsights').defaultClient, 'trackException');

    appInsight.logException()
    expect(applicationinsightsSpy).toHaveBeenCalledTimes(0)
    expect(defaultClientTrackExceptionSpy).toHaveBeenCalledTimes(1)
  })
})
