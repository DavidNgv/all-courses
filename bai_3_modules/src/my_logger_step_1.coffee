_ = require 'underscore'

__myConsole = console;
MyStringUtils = require './my_string_utils_step_1'

class MyLogger
  @log: (msgs...) ->
    messages = ''

    for msg in msgs
      messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

    __myConsole.log MyStringUtils.getDateTimeStr(), ': ', messages
    return

  @debug: (msgs...) ->
    messages = ''

    for msg in msgs
      messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

    __myConsole.info MyStringUtils.getDateTimeStr(), ': ', messages
    return

  @warn: (msgs...) ->
    messages = ''

    for msg in msgs
      messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

    __myConsole.warn MyStringUtils.getDateTimeStr(), ': ', messages
    return

  @error: (msgs...) ->
    messages = ''

    for msg in msgs
      messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

    __myConsole.error MyStringUtils.getDateTimeStr(), ': ', messages
    return

module.exports = MyLogger