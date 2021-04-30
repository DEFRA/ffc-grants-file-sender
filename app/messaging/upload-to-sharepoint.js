const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')
module.exports = async function (msg, fileCreatedReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(body)
    await fileCreatedReceiver.completeMessage(msg)
    await protectiveMonitoringServiceSendEvent(msg.correlationId, 'FTF-FILE-SENT-TO-SHAREPOINT', '0706')
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await fileCreatedReceiver.abandonMessage(msg)
  }
}
