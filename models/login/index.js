module.exports = async function(body) {
  
  const crypto = require('crypto')
  const User = this
  const user = await User.findOne({ login: body.login })

  if (!user || !user.checkPassword(body.password)) {
    return { type: "error", message: "Неверное имя пользователя или пароль" }
  }

  const buffer = await crypto.randomBytes(48)
  user.realLocation = body.location
  if (!user.location) { // если ползователь не менял геолокацию
    user.geoLoc.coordinates = [body.location.y, body.location.x]
  }
  user.token = buffer.toString('hex')
  await user.save()

  return { type: "ok", token: user.token } 

}