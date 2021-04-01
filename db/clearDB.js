const mongo = require('./mongo')

mongo.connection.on("open", () => {
  mongo.connection.db.dropDatabase(() => {
    mongo.disconnect()
  })
})