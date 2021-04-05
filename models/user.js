module.exports = function(io) {
  const crypto = require('crypto')
  const mongo = require('../db/mongo')

  const pointSchema = new mongo.Schema({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    }
  })

  let schema = new mongo.Schema({
    geoLoc: { // геолокация по которой ведутся расчеты дистанции, равна выбранной или реальной, если выбранная отсутствует
      type: pointSchema,
      index: '2dsphere',
    },
    realLocation: { // реальная геолокация пользователя, обновляется при логине
      type: Object,
    },
    location: { // выбранная пользователем геолокация, обновляется при изменении профиля
      type: Object,
    },
    login: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    biography: {
      type: String,
    },
    tags: {
      type: Array,
    },
    gender: {
      type: String,
    },
    preference: {
      type: Array,
    },
    images: {
      type: Object,
    },
    rating: {
      type: Number,
    },
    isFilled: {
      type: Boolean,
    },
    likeList: {
      type: Array,
      default: [],
      required: true,
    }
  })

  schema.statics.getChatList = require('./get_chat_list')

  schema.statics.getUsers = require('./get_users')
  
  schema.statics.login = require('./login')
  
  schema.statics.logout = async (req) => {

    await this.findOneAndUpdate({ login: req.user.login }, { token: '' })

    return { type: "ok" }

  }
  
  schema.statics.updateUser = require('./profile_update')
  
  schema.statics.getUserByName = require('./get_profile')
  
  schema.statics.registration = require('./registration')
  
  schema.virtual('password')
    .set(function(password) {
      this._plainPassword = password
      this.salt = Math.random() + ''
      this.token = ''
      this.hashedPassword = this.encryptPassword(password)
    })
    .get(function() { return this._plainPassword })
  
  schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword
  }

  schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
  }

  schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
  }

  // schema.index({
  //   ge: "2dsphere",
  // })

  const User = mongo.model('User', schema)

  return User

}