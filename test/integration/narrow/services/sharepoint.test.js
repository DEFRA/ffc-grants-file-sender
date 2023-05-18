const { expect } = require('@jest/globals')
const config = require('../../../../app/config/sharepoint')
const { setup, uploadFile } = require('../../../../app/services/sharepoint')

jest.mock('@pnp/nodejs-commonjs', () => {
	return {
		AdalFetchClient: jest.fn().mockImplementation(() => {
			return {
				acquireToken: () => {
					console.log('here: ', 'HEEEY!! first mock');
					return {
						accessToken: 'access_token'
					}
				}
			}
		})
	}
})

jest.mock('@hapi/wreck', () => {
	return {
		get: () => ({
				payload: {
					id: 'site_id',
					value: [
						{
							id: 'drive_id',
							name: 'document_library'
						}
					]
				}
			}),
		put: () => {}
		}
})

jest.mock('../../../../app/config/sharepoint', () => {
	return {
		tenantId: 'tenant_id',
		clientId: 'client_id',
		clientSecret: 'client_secret',
		hostname: 'hostname',
		sitePath: 'site_path',
		documentLibrary: 'document_library'
	}
})



describe('SharePoint functions', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	afterAll(() => {
		jest.restoreAllMocks();
	});

	describe('setup', () => {
		it('should be defined', async () => {
			expect(setup).toBeDefined()
		})
	})

	describe('uploadFile', () => {
		it('should be defined', async () => {
			expect(uploadFile).toBeDefined()
		})
	})

})