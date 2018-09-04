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
  it ('should log using a given appName and functionName', async () => {
    funcmatic.use(PapertrailPlugin, {
      host: process.env.PAPERTRAIL_HOST,
      port: process.env.PAPERTRAIL_PORT,
      appName: 'bigfiles-api',
      functionName: 'funcmatic-cli-test-2'
    })
    var event = { }
    var context = { 
      "awsRequestId": "cf657dbb-ae58-11e8-ab9f-8328009a7b9d", 
      "functionName": "50c85c59-9f7f-4bec-afa0-94e6a96acda3", 
      "functionVersion": 21
    }
    funcmatic.invoke(event, context, async (event, context, { papertrail }) => {
      papertrail.info("should be logged with papertrail hostname and program based on request context")
      papertrail.error("error message")
    })
  })
})