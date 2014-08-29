cliColor = require 'cli-color'


class MyStringUtils
  @getDateTimeStr: (level)->
    result = ''

    date = new Date()
    dateStr = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate()
    timeStr = date.toLocaleTimeString()
    result = dateStr + ' ' + timeStr + ': '
    result = @colorString level, result

    result

  @firstUpperCase: (str) ->
    str.substr(0,1).toUpperCase() + str.substr(1, str.length - 1)

  @colorString: (level, msg) ->
    switch level
      when 'log' then return cliColor.black.bgWhite.underline msg
      when 'debug' then return cliColor.black.bgGreen.underline msg
      when 'warn' then return cliColor.red.bgYellow.underline msg
      when 'error' then return cliColor.white.bgRed.underline msg
    return ''
module.exports = MyStringUtils
