const mongo = require('../../db/mongo')

module.exports = async function(req) {

  const User = this
  const login = req.params.login || req.user.login
  const user = (await User
    .aggregate([
      {
        $addFields: { "likedTo": false },
      },
      {
        $addFields: { "likedFrom": false },
      },
      {
        $match: { login, }
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
  
  if (req.params.login) {
    user.likedTo = await mongo.models.Actions.checkIfUserLikeMe(req.user, user)
    user.likedFrom = await mongo.models.Actions.checkIfILikeUser(req.user, user)
  }
  
  if (req.params.login) delete user.email
  else {
    delete user.likedFrom
    delete user.likedTo
  }
  delete user._id

  return { type: "ok", data: user }

  //   if (req.user.login !== login) {
  //     new mongo.models.Actions({
  //       who: req.user._id,
  //       action: 'visit',
  //       target: user._id,
  //     }).save((err, action) => {
  //       if (err) callback(null, { type: "error", message: "Error occurred on the server" })
  //       io.emit(user.login, {
  //         action:         action.action,
  //         created:        action.created, 
  //         who: {
  //           age:          req.user.age,
  //           avatar:       req.user.avatar,
  //           biography:    req.user.biography,
  //           created:      req.user.created,
  //           rating:  req.user.rating,
  //           fname:        req.user.fname,
  //           gender:       req.user.gender,
  //           images:       req.user.images,
  //           likeList:     req.user.likeList,
  //           lname:        req.user.lname,
  //           location:     req.user.location,
  //           login:        req.user.login,
  //           preference:   req.user.preference,
  //           tags:         req.user.tags,
  //         }
  //       })
  //       user = JSON.parse(JSON.stringify(user))
  //       delete user._id
  //       callback(null, { type: "ok", message: "", data: user })
  //     })
  //   } else {
  //     user = JSON.parse(JSON.stringify(user))
  //     delete user._id
  //     callback(null, { type: "ok", message: "", data: user })
  //   }
  // }
}
