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

  schema.statics.checkIfUserLikeMe = async function(curUser, targetUser) {

    const likeAction = await mongo.models.Actions.findOne(
      {
        who: targetUser._id,
        target: curUser._id,
        $or: [
          { action: 'dislike' },
          { action: 'like' },
        ],
      },
      {},
      { sort: { 'created' : -1 } }
    )
    return likeAction ? likeAction.action === "like" : false
  }

  schema.statics.checkIfILikeUser = async function(curUser, targetUser) {

    const likeAction = await mongo.models.Actions.findOne(
      {
        target: targetUser._id,
        who: curUser._id,
        $or: [
          { action: 'dislike' },
          { action: 'like' },
        ],
      },
      {},
      { sort: { 'created' : -1 } }
    )
    return likeAction ? likeAction.action === "like" : false
  }

  schema.statics.likeUser = require('./like_user')
  
  schema.statics.sendMessage = function(req, callback) {
    const User = mongo.models.User
    const Actions = mongo.models.Actions
  
    // a.waterfall([
    //   (callback) => {
    //     User.findOne({ login: req.body.target }, callback)
    //       .select('-salt -token -hashedPassword -__v -created')
    //   },
    //   (user, callback) => {
    //     if (!user) {
    //       callback(null, { type: "error", message: "Невозможно выполнить операцию!" })
    //     }
    //     if (req.user.login !== user.login) {
    //       new Actions({
    //         target: user._id,
    //         action: 'messages',
    //         who: req.user._id,
    //         message: req.body.message,
    //       }).save((err, action) => {
    //         if (err) callback(null, { type: "error", message: "Невозможно выполнить операцию!" })
    //         const resp = {
    //           action:         action.action,
    //           created:        action.created,
    //           message:        action.message,
    //           who: {
    //             age:                req.user.age,
    //             avatar:             req.user.avatar,
    //             biography:          req.user.biography,
    //             // created:            req.user.created,
    //             rating:        req.user.rating,
    //             fname:              req.user.fname,
    //             gender:             req.user.gender,
    //             images:             req.user.images,
    //             likeList:           req.user.likeList,
    //             lname:              req.user.lname,
    //             location:           req.user.location,
    //             login:              req.user.login,
    //             preference:         req.user.preference,
    //             tags:               req.user.tags,
    //             isFilled:  req.user.isFilled,
    //           }
    //         }
    //         io.emit(user.login, resp)
    //         callback(null, { type: "ok", message: "", data: resp })
    //       })
    //     }
    //   },
    // ], callback)
  }
  
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