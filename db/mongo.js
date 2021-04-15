const mongoose = require('mongoose')
const dbURL = process.env.MONGODB_URI ? `mongodb+srv://mskiles:${process.env.MONGODB_URI}@cluster0.4gi9n.mongodb.net/myFirstDatabase?retryWrites=true` : 'mongodb://localhost:27017/test'

mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})

module.exports = mongoose