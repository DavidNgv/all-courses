###
  use it for coloring
###

#https://github.com/medikoo/cli-color
cliColor = require 'cli-color'
_ = require 'underscore'

Logger = require './logger'
logger = Logger.inject()

class Utils
	@_getDateTimeStr: ->
		result = ''
	
		date = new Date()
		dateStr = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate()
		timeStr = date.toLocaleTimeString()
		result = dateStr + ' ' + timeStr
	
		result

	@writeLog: (msgs...) ->
		messages = ''

		for msg in msgs
			messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

		#console.log cliColor.red.bgWhite.underline(@_getDateTimeStr()), messages
		#logger.info @_getDateTimeStr() + messages
		logger.info @_getDateTimeStr() + ' - ' + messages
		return

	@logInfo: (msgs...) ->
		messages = ''
		first = true
		for msg in msgs
			messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

		logger.info @_getDateTimeStr() + ' - ' + messages
		return
            
	@logDebug: (msgs...) ->
		messages = ''

		for msg in msgs
			messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

		logger.warn @_getDateTimeStr() + ' - ' + messages
		return
            
	@logWarn: (msgs...) ->
		messages = ''

		for msg in msgs
			messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

		logger.warn @_getDateTimeStr() + ' - ' + messages
		return
            
	@logError: (msgs...) ->
		messages = ''

		for msg in msgs
			messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '

		logger.error @_getDateTimeStr() + ' - ' + messages
		return
            
	@writeWarnLog: (msgs...) ->
		messages = ''

		for msg in msgs
			messages += if _.isString(msg) then msg else JSON.stringify(msg, null, '\t') + ' '
		logger.warn @_getDateTimeStr() + ' - ' + messages
		return
		
	@handleError: (message, error, res) ->
		@writeLog message
		@writeLog error
		
		res.send error, 404
	
		return

	@handleResponse: (message, docs, res) ->
		res.contentType 'application/json'
		
		if docs instanceof Array
			#Utils.writeLog "Found #{docs.length} docs, content:"
			#console.log docs
			
			if docs.length is 1
				res.send docs[0]
			else
				res.send docs
		else
			#Utils.writeWarnLog "Found 1 doc, content:"
			#console.log docs
			res.send docs
	
		@writeLog message
	
		return

	@checkReqParams: (req, res) ->
		result = true
		
		databaseName = req.params.database
		collectionName = req.params.collection
	
		if !databaseName?
			@writeWarnLog 'Database name Undefined'
			
			res.send 'database name Undefined', 404
			result = false
	
		if !collectionName?
			@writeWarnLog 'Collection name Undefined'
			
			res.send 'collection name Undefined', 404
			result = false
	
		@writeLog "Database name: #{databaseName}"
		@writeLog "Collection name: #{collectionName}"
	
		result

	@checkReqParamsOk: (req) ->
		result = ''
		
		databaseName = req.params.database
		collectionName = req.params.collection
	
		if not databaseName?
			result 'Database name Undefined'
			
		if not collectionName?
			result 'Collection name Undefined'
	
		return result

	@getParam: (req, parameter_name, defaultValue='') ->
		parameter_value = defaultValue
	
		if req.body[parameter_name]?
			parameter_value = req.body[parameter_name]
			
		else if req.query[parameter_name]?
			parameter_value = req.query[parameter_name]
	
		parameter_value
		
	@firstUpperCase: (str) ->
		str.substr(0,1).toUpperCase() + str.substr(1, str.length - 1)
		
	@convertTableName: (str) =>
		arrs = str.split '_'
		#res = @firstUpperCase(item) for item in arrs
		#res = res.join ''
		res = ''
		for item in arrs
			res += @firstUpperCase(item)
		return res

	@getClientIp: (req) ->
		x_ip = null
		forwardedIps = req.headers['x-forwarded-for']

		if forwardedIps
			x_ip = forwardedIps.split(',')[0]

		unless x_ip?
			x_ip = req.connection.remoteAddress

		x_ip

exports.Utils = Utils
