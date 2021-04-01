module.exports = async function({ login, location, password }) {
  
  const crypto = require('crypto')
  const user = await this.findOne({ login })

  if (!user || !user.checkPassword(password)) {
    return { type: "error", message: "Неверное имя пользователя или пароль" }
  }

  const buffer = await crypto.randomBytes(48)
  user.realLocation = location
  if (!user.location) { // если ползователь не менял геолокацию
    user.geoLoc.coordinates = [location.y, location.x]
  }
  user.token = buffer.toString('hex')
  await user.save()

  return { type: "ok", token: user.token } 

}