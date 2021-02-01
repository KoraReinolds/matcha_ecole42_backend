module.exports = async function(body) {
  
  const User = this
  const user = await User.findOne({ login: body.login })

  if (user) {
    return { type: "error", message: "Пользователь с таким логином уже существует" }
  }
  const newUser = new User({
    ...body,
    geoLoc: {
      type: "Point",
      coordinates: [body.location.y, body.location.x],
    },
    location: null,
    isFilled: false,
    age: null,
    rating: 0,
    preferences: [],
    biography: '',
    tags: [],
    images: [],
  })
  await newUser.save()
  return { type: "ok" }
    
}