module.exports = async function(body) {
  
  const user = await this.findOne({ login: body.login })
  const User = this

  if (user) {
    return { type: "error", message: "Пользователь с таким логином уже существует" }
  }

  await new User({
    ...body,
    geoLoc: {
      type: "Point",
      coordinates: [0, 0],
    },
    location: null,
    isFilled: false,
    age: null,
    rating: 0,
    preferences: [],
    gender: '',
    biography: '',
    tags: [],
    images: [],
  }).save()
  
  return { type: "ok" }
    
}