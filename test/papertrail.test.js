var Funcmatic = require('@funcmatic/funcmatic')
var PapertrailPlugin = require('../lib/papertrail')

var handler = Funcmatic.wrap(async (event, { papertrail }) => {
  papertrail.info('this is my message')
  return {
    statusCode: 200
  }
})

describe('Request', () => {
  beforeEach(() => {
    Funcmatic.clear()
  })
  it ('should send a papertrail log event', async () => {
    Funcmatic.use(PapertrailPlugin, { 
      host: process.env.PAPERTRAIL_HOST,
      port: process.env.PAPERTRAIL_PORT
    })
    var event = { }
    var context = { }
    var ret = await handler(event, context)
    console.log("RET", ret)
  })
})