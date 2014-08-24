###
  Use it for displaying color code in console
  https://github.com/medikoo/cli-color
###

cliColor = require 'cli-color'
_ = require 'underscore'
__myConsole = console;

class Utils
	@_getDateTimeStr: ->
		result = ''
	
		date = new Date()
		dateStr = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate()
		timeStr = date.toLocaleTimeString()
		result = dateStr + ' ' + timeStr
		result = cliColor.red.bgWhite.underline result

		result

	@writeLog: (msgs...) ->
		messages = ''

		for msg in msgs
			messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

		__myConsole.log @_getDateTimeStr(), ': ', messages
		return

	@getClientIp: (req) ->
		x_ip = null
		forwardedIps = req.headers['x-forwarded-for']

		if forwardedIps
			x_ip = forwardedIps.split(',')[0]

		unless x_ip?
			x_ip = req.connection.remoteAddress

		x_ip

module.exports = Utils
