// https://github.com/kenperkins/winston-papertrail
// winston-papertrail is not compatible with winston 3.x so 
// need to install winston@2.4.3

var winston = require('winston')
var Papertrail = require('winston-papertrail').Papertrail

class PapertrailPlugin {
  
  constructor() {
    this.name = 'papertrail'
    this.cache = false
  }
  
  async start(conf) {
    this.name = conf.name || this.name
    this.conf = conf
    this.cache = conf.cache
    var transports = [ new winston.transports.Console() ]
    if (!conf.consoleOnly) { // only log to console, don't send to paperclip service
      this.winstonpapertrail = new winston.transports.Papertrail({
        host: conf.host,
        port: conf.port,
        level: conf.level || 'info',
        flushOnClose: true
      })
      this.winstonpapertrail.on('error', function(err) {
        console.log(`Plugin ${this.name} error: ${err.message}`)
      });
      transports.push(this.winstonpapertrail)
    }
    this.logger = new winston.Logger({ transports })
    this.logger.consoleOnly = conf.consoleOnly
  }
  
  async request(event, context) {
    var service = this.logger
    return { service }
  }
  
  async end(options) {
    if (!this.cache) this.logger.close()
  }

  // async response(event, context, res) {
  //   if (!this.cache) this.logger.close()
  // }

  async error(err, event, context, res) {
    this.logger.error(err)
  }
}

module.exports = PapertrailPlugin