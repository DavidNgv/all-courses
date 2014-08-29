_ = require 'underscore'

__myConsole = console;
MyStringUtils = require './my_string_utils_step_2'

__myLog = (logLevel, args)->
  messages = ''

  for msg in args
    messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

#  messages = MyStringUtils.getDateTimeStr() + ': ' + messages
  messages = MyStringUtils.getDateTimeStr(logLevel) + MyStringUtils.colorString(logLevel, messages)
  __myConsole[this.functionName[logLevel]](messages)
  return

class MyLogger
  @functionName: {'log':'log', 'debug': 'info', 'warn': 'warn', 'error': 'error'}

  @log: (msgs...) ->
    _.bind(__myLog, this, 'log', msgs)();
    return

  @debug: (msgs...) ->
    _.bind(__myLog, this, 'debug', msgs)();
    return

  @warn: (msgs...) ->
    _.bind(__myLog, this, 'warn', msgs)();
    return

  @error: (msgs...) ->
    _.bind(__myLog, this, 'error', msgs)();
    return

module.exports = MyLogger