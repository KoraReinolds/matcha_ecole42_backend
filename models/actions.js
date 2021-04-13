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
  readed: {
    type: Boolean,
    default: false,
  },
  msg_readed: {
    type: Boolean,
    default: false,
  },
})

schema.statics.emitLastAction = require('./emit_last_action')

schema.statics.likeUser = require('./like_user')

schema.statics.sendMessage = require('./send_message')

schema.statics.getMessages = require('./get_messages')

schema.statics.getNotifications = require('./notifications')

schema.statics.getHistory = require('./history')

schema.statics.getUnreadedNotifications = require('./get_unreaded_notifications')

module.exports = mongo.model('Actions', schema)