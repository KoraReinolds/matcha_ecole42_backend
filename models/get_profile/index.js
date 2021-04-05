const mongo = require('../../db/mongo')

module.exports = async function(req) {

  const User = this
  const login = req.params.login || req.user.login
  const user = (await User
    .aggregate([
      {
        $match: { login }
      },
      {
        $addFields: { likedTo: { $in: [req.user.login, "$likeList"] } },
      },
      {
        $addFields: { likedFrom: { $in: [login, req.user.likeList] } },
      },
      {
        $project: {
          __v: 0,
          realLocation: 0,
          salt: 0,
          token: 0,
          hashedPassword: 0,
          created: 0,
          geoLoc: 0,
        }
      }
    ]))[0]

  if (!user || (req.params.login && !user.isFilled)) {
    return { type: "error", message: "User not found" }
  }

  if (req.params.login) {
    await new mongo.models.Actions({
      who: req.user._id,
      action: 'visit',
      target: user._id,
    }).save()
  }
  
  if (req.params.login) delete user.email
  else {
    delete user.likedFrom
    delete user.likedTo
  }
  delete user._id

  return { type: "ok", data: user }

}
