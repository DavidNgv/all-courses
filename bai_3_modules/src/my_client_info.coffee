class MyClientInfo
  @getClientIp: (req) ->
    x_ip = null
    forwardedIps = req.headers['x-forwarded-for']

    if forwardedIps
      x_ip = forwardedIps.split(',')[0]

    unless x_ip?
      x_ip = req.connection.remoteAddress

    x_ip

module.exports = MyClientInfo