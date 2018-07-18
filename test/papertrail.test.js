var Funcmatic = require('@funcmatic/funcmatic')
var PapertrailPlugin = require('../lib/papertrail')

var handler = Funcmatic.wrap(async (event, context, { papertrail }) => {
  console.log("consoleOnly", papertrail.consoleOnly) 
  var message = 'this is my message to papertrail'
  if (papertrail.consoleOnly) {
    message = 'this is my message to console only'
  } 
  papertrail.info(message)

  return {
    statusCode: 200
  }
})

describe('Request', () => {
  beforeEach(() => {
    Funcmatic.clear()
  })
  afterAll(() => {
    
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
  it ('should not send a papertrail log event', async () => {
    Funcmatic.use(PapertrailPlugin, { 
      host: process.env.PAPERTRAIL_HOST,
      port: process.env.PAPERTRAIL_PORT,
      consoleOnly: true
    })
    var event = { }
    var context = { }
    var ret = await handler(event, context)
  })
})