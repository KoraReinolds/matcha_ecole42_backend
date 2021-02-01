const mongo = require('./mongo')

try {
  mongo.connection.on("open", () => {
    let db = mongo.connection.db
    db.dropDatabase()
  })
} finally {
  mongo.disconnect()
}