const mongo = require('./mongo')
const dataGenerator = require('../dataGeneration')

try {
  mongo.connection.on("open", async () => {
    await mongo.connection.db.dropDatabase()
    require('../models/user')()
    let users = dataGenerator.generateUsers(100)
    const promises = users.map(user =>new mongo.models.User(user).save())
    await Promise.all(promises)

    mongo.disconnect()
  })
} catch {
  mongo.disconnect()
}