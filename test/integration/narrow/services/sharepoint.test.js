const config = require('../../../../app/config/sharepoint')
// const{ * as pnpAPI } = require('@pnp/nodejs-commonjs') 
// const wreck = require('@hapi/wreck')
const { setup, uploadFile } = require('../../../../app/services/sharepoint')

const { AdalFetchClient } = require('@pnp/nodejs-commonjs') 

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
		it.only('should get SharePoint Site and Document Library ID', async () => {
			await setup()
			expect(AdalFetchClient).toHaveBeenCalledTimes(1)
			// expect(get).toHaveBeenCalledWith(
			// 	`https://graph.microsoft.com/v1.0/sites/${config.hostname}:/${config.sitePath}`,
			// );
			// expect(mockFn).toHaveBeenCalled()
			// expect(wreck.get).toHaveBeenCalledWith(
			// 	`https://graph.microsoft.com/v1.0/sites/${siteId}/drives`,
			// );
			// expect(siteId).toEqual('site_id');
			// expect(documentLibraryId).toEqual('drive_id');
		})

	})

	describe('uploadFile', () => {
		it('should upload a file to SharePoint', async () => {
			const buffer = Buffer.from('test file')
			const filename = 'test.txt'
			const uploadLocation = '/test/folder/'

			const accessToken = 'access_token'

			AdalFetchClient.mockReturnValueOnce({
				acquireToken: jest.fn().mockResolvedValueOnce({ accessToken })
			})
			wreck.put.mockResolvedValueOnce()

			await uploadFile(buffer, filename, uploadLocation)

			expect(AdalFetchClient).toHaveBeenCalledWith(config.tenantId, config.clientId, config.clientSecret)

			expect(wreck.put).toHaveBeenCalledWith(
				`https://graph.microsoft.com/v1.0/sites/${config.siteId}/drives/${config.documentLibraryId}/root:/${encodeURIComponent(uploadLocation)}${encodeURIComponent(filename)}:/content`,
				{ payload: buffer, headers: { Authorization: `Bearer ${accessToken}` } }
			)
		})

		it('should call setup if siteId or documentLibraryId is not set', async () => {
			const buffer = Buffer.from('test file')
			const filename = 'test.txt'
			const uploadLocation = '/test/folder/'

			AdalFetchClient.mockReturnValueOnce({
				acquireToken: jest.fn().mockResolvedValueOnce({ accessToken: 'access_token' })
			})
			wreck.put.mockResolvedValueOnce()

			await uploadFile(buffer, filename, uploadLocation)

			expect(AdalFetchClient).toHaveBeenCalledTimes(2) // called twice due to setup call
			expect(wreck.put).toHaveBeenCalled()
		})
	})
})