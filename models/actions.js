module.exports = function(io) {

  const mongo = require('../db/mongo')
  const { Schema } = require('../db/mongo')

  let schema = new mongo.Schema({
    action: {
      type: String,
      required: true,
    },
    who: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  })

  schema.statics.likeUser = require('./like_user')

  schema.statics.sendMessage = require('./send_message')
  
  schema.statics.getMessages = function(req, callback) {
    const User = mongo.models.User
  
    // a.waterfall([
    //   (callback) => {
    //     User.findOne({ login: req.body.login }, callback)
    //   },
    //   (user, callback) => {
    //     if (!user) {
    //       callback(null, { type: "error", message: "User not found" })
    //     } else {
    //       this.find({
    //         action: 'messages',
    //         $or: [
    //           {$and: [{who: req.user._id}, {target: user._id}]},
    //           {$and: [{target: req.user._id}, {who: user._id}]},
    //         ]
    //       })
    //         .populate('who target', 'login -_id')
    //         .select('who target action message created -_id')
    //         .exec((err, users) => {
    //           if (err) return callback(err)
    //           callback(null, { type: "ok", message: "", data: users })
    //         })
    //     }
    //   },
    // ], callback)
  }

  schema.statics.getNotifications = require('./notifications')

  schema.statics.getHistory = require('./history')

  return mongo.model('Actions', schema)
}