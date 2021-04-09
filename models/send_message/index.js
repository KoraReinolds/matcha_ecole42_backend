const mongo = require('../../db/mongo')

module.exports = async function(req) {

  const Users = mongo.models.User
  const Actions = mongo.models.Actions

  const user = await Users.findOne({ login: req.body.target })

  await new Actions({
    who: req.user._id,
    action: 'messages',
    target: user._id,
    message: req.body.message,
  }).save()

  return { type: "ok" }
  
}