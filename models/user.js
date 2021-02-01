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

  const getLocation = function() {
    return this.geoLoc ?
      {
        x: this.geoLoc.coordinates[0],
        y: this.geoLoc.coordinates[1]
      } : null
  }

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
      // get: getLocation,
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
      type: String,
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
  })
  // }, { toJSON: { getters: true } })
  
  schema.statics.getUsersForChat = async function(req, callback) {
    const docs = await this.find({
      login: { $in: req.user.likeList },
    })
      .select('-_id -salt -token -hashedPassword -__v -email -created')
    let filteredDocs = docs
      .filter((user) => user.likeList.includes(req.user.login))
    callback(null, { type: "ok", message: "", data: filteredDocs })
  }

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

  const User = mongo.model('User', schema)

  return User

}