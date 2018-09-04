require('dotenv').config()
var funcmatic = require('@funcmatic/funcmatic')
var PapertrailPlugin = require('../lib/papertrail')

describe('Request', () => {
  beforeEach(async () => {
    funcmatic = funcmatic.clone()
  })
  afterAll(async () => {
    await funcmatic.teardown()
  })
  it ('should send a papertrail log event', async () => {
    funcmatic.use(PapertrailPlugin, {
      host: process.env.PAPERTRAIL_HOST,
      port: process.env.PAPERTRAIL_PORT
    })
    var event = { }
    var context = { }
    funcmatic.invoke(event, context, async (event, context, { papertrail }) => {
      expect(papertrail).toBeTruthy()
      expect(papertrail.consoleOnly).toBeFalsy()
      papertrail.info("hello world!")
    })
  })
  it ('should not send a papertrail log event', async () => {
    funcmatic.use(PapertrailPlugin, {
      host: process.env.PAPERTRAIL_HOST,
      port: process.env.PAPERTRAIL_PORT,
      consoleOnly: true
    })
    var event = { }
    var context = { }
    funcmatic.invoke(event, context, async (event, context, { papertrail }) => {
      expect(papertrail).toBeTruthy()
      expect(papertrail.consoleOnly).toBeTruthy()
      papertrail.info("this message should NOT be logged to papertrail")
    })
  })
})



// var handler = Funcmatic.wrap(async (event, context, { papertrail }) => {
//   console.log("consoleOnly", papertrail.consoleOnly) 
//   var message = 'this is my message to papertrail'
//   if (papertrail.consoleOnly) {
//     message = 'this is my message to console only'
//   } 
//   papertrail.info(message)

//   return {
//     statusCode: 200
//   }
// })
