const mongo = require('../../db/mongo')

module.exports = async function(req) {

  const Actions = this
  const Users = mongo.models.User

  const user = await Users.findOne({ login: req.body.login })

  // if like add new user to list of likes
  if (req.body.value === 1) req.user.likeList.push(req.body.login)
  // if dislike remove new user from list of likes
  else if (req.body.value === 0) {
    const set = new Set(req.user.likeList)
    set.delete(req.body.login)
    req.user.likeList = [...set]
  }

  await req.user.save()

  if (!user) {
    return { type: "error", message: "Невозможно выполнить операцию!" }
  }

  await new Actions({
    who: req.user._id,
    target: user._id,
    action: +req.body.value ? 'like' : 'dislike',
  }).save()

  Actions.emitLastAction(req, user)
  
  return { type: "ok" }
    
}