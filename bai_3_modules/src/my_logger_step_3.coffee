_ = require 'underscore'

__myConsole = console;
MyStringUtils = require './my_string_utils_step_2'

__myLog = (logLevel, args)->
  messages = ''

  for msg in args
    messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

  messages = MyStringUtils.getDateTimeStr(logLevel) + MyStringUtils.colorString(logLevel, messages)
  __myConsole[this.functionName[logLevel]](messages)
  return

class MyLogger
  @functionName: {'log':'log', 'debug': 'info', 'warn': 'warn', 'error': 'error'}

  @log: (msgs...) ->
    __myLog.bind(this, 'log', msgs)();
    return

  @debug: (msgs...) ->
    __myLog.bind(this, 'debug', msgs)();
    return

  @warn: (msgs...) ->
    __myLog.bind(this, 'warn', msgs)();
    return

  @error: (msgs...) ->
    console.log arguments.callee
    __myLog.bind(this, 'error', msgs)();
    return

module.exports = MyLogger