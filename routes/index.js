// module.exports = function() {
  const express = require('express')
  const router = express.Router()
  const User = require('../models/user')
  const Actions = require('../models/actions')

  const errorHandleWrapper = function(callback) {
    return function (req, res, next) {
      callback(req, res, next)
        .catch(next)
    }
  }

  router.use(errorHandleWrapper(async (req, res, next) => {
    let token = req.headers.authorization
    req.user = await User.findOne({token})
    next()
  }))
  
  router.get('/', (req, res, next) => {
    res.send(`Cookies: ${JSON.stringify(req.cookies)}`)
  })

  router.post('/register', errorHandleWrapper(async (req, res) => {
    res.json(await User.registration(req.body))
  }))

  router.post('/login', errorHandleWrapper(async (req, res) => {
    res.json(await User.login(req.body))
  }))

  router.use((req, res, next) => {
    if (!req.user) res.status(401).send()
    next()
  }),
  
  router.post('/send-message', errorHandleWrapper(async (req, res) => {
    res.json(await Actions.sendMessage(req))
  }))
  
  router.post('/get-messages', errorHandleWrapper(async (req, res) => {
    res.json(await Actions.getMessages(req))
  }))
  
  router.get('/chat-list', errorHandleWrapper(async (req, res) => {
    res.json(await User.getChatList(req))
  }))

  router.post('/history', errorHandleWrapper(async (req, res) => {
    res.json(await Actions.getHistory(req))
  }))

  router.post('/notifications', errorHandleWrapper(async (req, res) => {
    res.json(await Actions.getNotifications(req))
  }))
  
  router.post('/like-user', errorHandleWrapper(async (req, res) => {
    res.json(await Actions.likeUser(req))
  }))
  
  router.get(`/get-users`, errorHandleWrapper(async (req, res) => {
    res.json(await User.getUsers(req))
  }))
  
  router.post('/profile-update', errorHandleWrapper(async (req, res) => {
    res.json(await User.updateUser(req))
  }))

  router.post('/logout', errorHandleWrapper(async (req, res) => {
    res.json(await User.logout(req))
  }))

  router.post('/new-notifications', errorHandleWrapper(async (req, res) => {
    res.json(await Actions.getUnreadedNotifications(req))
  }))
  
  router.get('/profile-get', errorHandleWrapper(async (req, res) => {
    res.json(await User.getUserByName(req))
  }))
  
  router.get('/profile-get/:login', errorHandleWrapper(async (req, res) => {
    res.json(await User.getUserByName(req))
  }))

  router.use((req, res, next) => {
    res.json({
      type: "error",
      message: "Произошла ошибка. Обратитесь к администратору",
    })
  })

  module.exports = router

//   return router
// }