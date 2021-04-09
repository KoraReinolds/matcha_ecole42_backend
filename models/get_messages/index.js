const mongo = require('../../db/mongo')

module.exports = async function(req) {

  const Users = mongo.models.User
  const Actions = mongo.models.Actions

  const user = await Users.findOne({ login: req.body.target })

  return { type: "ok", data: await this.aggregate([
    {
      $match: {
        action: 'messages',
        $or: [
          { $and: [{ who: req.user._id }, { target: user._id }] },
          { $and: [{ target: req.user._id }, { who: user._id }] },
        ],
      }
    },
    {
      $addFields: { our: { $eq: ['$who', req.user._id] } },
    },
    {
      $project: { '_id': 0, '__v': 0, 'who': 0, 'target': 0 }
    },
  ])}
 
}