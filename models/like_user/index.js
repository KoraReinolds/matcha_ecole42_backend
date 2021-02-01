const mongo = require('../../db/mongo')

module.exports = async function(req) {

  const Actions = this

  const user = await mongo.models.User.findOne({ login: req.body.login })

  if (!user) {
    return { type: "error", message: "Невозможно выполнить операцию!" }
  }

  await new Actions({
    who: req.user._id,
    action: +req.body.value ? 'like' : 'dislike',
    target: user._id,
  }).save()
  
  return { type: "ok" }

  // (err, action) => {
  //   io.emit(user.login, {
  //     action:         action.action,
  //     created:        action.created, 
  //     who: {
  //       age:          req.user.age,
  //       avatar:       req.user.avatar,
  //       biography:    req.user.biography,
  //       created:      req.user.created,
  //       rating:       req.user.rating,
  //       fname:        req.user.fname,
  //       gender:       req.user.gender,
  //       images:       req.user.images,
  //       likeList:     req.user.likeList,
  //       lname:        req.user.lname,
  //       location:     req.user.location,
  //       login:        req.user.login,
  //       preference:   req.user.preference,
  //       tags:         req.user.tags,
  //     }
  //   })
  // }
    
}