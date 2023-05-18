const { expect } = require('@jest/globals')
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

const wreck = require('@hapi/wreck')
const hapiGetSpy = jest.spyOn(wreck, 'get').mockResolvedValue({
	payload: {
		id: 'site_id',
		value: [
			{
				id: 'drive_id',
				name: 'document_library'
			}
		]
	}
})
const hapiPutSpy = jest.spyOn(wreck, 'put').mockResolvedValue({
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
	beforeEach(async () => {
		jest.mock('@hapi/wreck')
		jest.mock('@pnp/nodejs-commonjs')
	})

	afterAll(async () => {
		jest.restoreAllMocks();
	});

	describe('setup', () => {
		it('should run and call wreck.get', async () => {
			await setup();
			expect(hapiGetSpy).toHaveBeenCalledTimes(2)
		})
	})

	describe('uploadFile', () => {
		it('should run and call wreck.put with the correct params', async () => {
			const buffer = Buffer.from('test')
			const filename = 'test.txt'
			const uploadLocation = 'test'

			await uploadFile(buffer, filename, uploadLocation);
			expect(hapiPutSpy).toHaveBeenCalledTimes(1)
		})
	})

})