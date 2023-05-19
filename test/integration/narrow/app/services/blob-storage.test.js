const { downloadFile, deleteFile } = require('../../../../../app/services/blob-storage')

jest.mock('@azure/storage-blob', () => {
	console.log('test: 1 ', 'storage-blob mock');
	return {
		BlobServiceClient: {
			fromConnectionString: jest.fn().mockImplementation(() => {
				console.log('test: 2 ', 'fromConnectionString mock');
				return {
					getContainerClient: jest.fn().mockImplementation(() => {
						console.log('test: 3 ', 'getContainerClient mock');
						return {
							getBlockBlobClient: jest.fn().mockImplementation(() => {
								console.log('test: 4 ', 'getBlockBlobClient mock');
								return {
									downloadToBuffer: jest.fn().mockImplementation(() => {
										console.log('test: 5 ', 'downloadToBuffer mock');
										return {
											buffer: 'buffer',
											blockBlobClient: 'blockBlobClient'
										}
									}),
								}
							})
						}
					})
				}
			}),
			delete: jest.fn().mockImplementation(() => {
				console.log('test: 6 ', 'delete mock');
				return {
					buffer: 'buffer',
					blockBlobClient: 'blockBlobClient'
				}
			})
		}
	}
});

describe('Blob Storage', () => {
	it('downloadFile is called', () => {
		expect(downloadFile).toBeDefined()
	});

	it('deleteFile is called', () => {
		expect(deleteFile).toBeDefined()
	});

	it('downloadFile is called with filename', () => {
		const filename = 'mock-filename'
		const result = downloadFile(filename)
		expect(result).toBeDefined()
	}
	);

	it('deleteFile is called with blockBlobClient', () => {
		const mockDelete = jest.fn()
		const blockBlobClient = {
			delete: mockDelete
		}
		const result = deleteFile(blockBlobClient)
		expect(result).toBeDefined()
		expect(mockDelete).toHaveBeenCalledTimes(1)
	});
})
