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
    this.conf = conf
    this.cache = conf.cache
    this.winstonpapertrail = new winston.transports.Papertrail({
    	host: conf.host,
    	port: conf.port,
    	flushOnClose: true
    })
    this.logger = new winston.Logger({
    	transports: [ new winston.transports.Console(), this.winstonpapertrail ]
    })
    
    this.winstonpapertrail.on('error', function(err) {
      console.log(`Plugin ${this.name} error: ${err.message}`)
    });
  }
  
  async request(event, context) {
    context[this.name] = this.logger
    return { event, context }
  }
  
  async response(event, context, res) {
    if (!this.cache) this.logger.close();
    return res
  }
}

module.exports = new PapertrailPlugin()