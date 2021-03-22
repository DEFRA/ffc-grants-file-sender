const { BlobServiceClient } = require('@azure/storage-blob')

module.exports = async function (msg, fileCreatedReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(body)

    const connStr = process.env.BLOB_STORAGE_CONNECTION_STRING
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr)
    const containerClient = blobServiceClient.getContainerClient('paul-test')
    const blockBlobClient = containerClient.getBlockBlobClient(body.filename)
    const result = await blockBlobClient.downloadToFile(body.filename)
    console.log(result)
    console.log('Downloaded successfully')

    await fileCreatedReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await fileCreatedReceiver.abandonMessage(msg)
  }
}
