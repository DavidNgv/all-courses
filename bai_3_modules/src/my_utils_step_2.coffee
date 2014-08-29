BaseModule = require './base_module'

MyLogger = require './my_logger_step_2'
MyClientInfo = require './my_client_info'

class MyUtils extends BaseModule
  @extend MyLogger
  @extend MyClientInfo

module.exports = MyUtils
