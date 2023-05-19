const { downloadFile, deleteFile } = require('../../../../../app/services/blob-storage')

describe('Blob Storage', () => {
	it('downloadFile is called', () => {
		expect(downloadFile).toBeDefined()
	});

	it('deleteFile is called', () => {
		expect(deleteFile).toBeDefined()
	});
})
