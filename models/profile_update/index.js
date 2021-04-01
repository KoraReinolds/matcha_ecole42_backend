module.exports = async function({ user, body }) {

  const User = this

  if (body.location) { // обновляем геолокацию, если пользователь хочет ее изменить
    body.geoLoc = {
      type: "Point",
      coordinates: [body.location.x, body.location.y],
    }
    // delete body.location
  }

  await User.findOneAndUpdate({ login: user.login }, { ...body, isFilled: true })

  return { type: "ok" }

}
