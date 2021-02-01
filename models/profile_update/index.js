module.exports = async function({ user, body }) {

  const User = this

  if (body.location) { // обновляем геолокацию, если пользователь хочет ее изменить
    const location = [body.location.x, body.location.y]
    body.geoLoc = {
      type: "Point",
      coordinates: location,
    }
    delete body.location
  }

  await User.findOneAndUpdate({ login: user.login }, { ...body, isFilled: true })

  return { type: "ok" }

}
