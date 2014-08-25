cliColor = require 'cli-color'


class MyStringUtils
  @getDateTimeStr: ->
    result = ''

    date = new Date()
    dateStr = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate()
    timeStr = date.toLocaleTimeString()
    result = dateStr + ' ' + timeStr
    result = cliColor.red.bgWhite.underline result

    result

  @firstUpperCase: (str) ->
    str.substr(0,1).toUpperCase() + str.substr(1, str.length - 1)


module.exports = MyStringUtils
