const mongoose = require('mongoose')
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'

mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})

module.exports = mongoose