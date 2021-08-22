const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')
const appInsights = require('../services/app-insights')
const blobStorage = require('../services/blob-storage')
const sharepoint = require('../services/sharepoint')

module.exports = async function (msg, fileCreatedReceiver) {
  try {
    const { body } = msg
    console.log('Received message:', body)

    const filename = body.filename
    const { buffer, blockBlobClient } = await blobStorage.downloadFile(filename)
    await sharepoint.uploadFile(buffer, filename, body.uploadLocation)
    await blobStorage.deleteFile(blockBlobClient)

    await fileCreatedReceiver.completeMessage(msg)
    await protectiveMonitoringServiceSendEvent(msg.correlationId, 'FTF-FILE-SENT-TO-SHAREPOINT', '0706')
  } catch (err) {
    appInsights.trackEvent({ name: 'Sharepoint Upload Failed' })
    appInsights.trackMetric({
      name: 'Sharepoint Upload Failed',
      correlationId: msg?.correlationId,
      error: err,
      filename: msg.body.filename,
      location: msg.body.uploadLocation
    })
    appInsights.logException(err, msg?.correlationId)
    await fileCreatedReceiver.abandonMessage(msg)
    console.error('Unable to process message')
    console.error(err)
  }
}
