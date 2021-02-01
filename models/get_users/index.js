const mongo = require('../../db/mongo')

module.exports = async function({
  user,
  query: {
    needPreference: pref,
    ageMin,
    ageMax,
    deltaRadius,
    minRating,
    maxRating,
    tags,
    sortLocation,
    sortAge,
    sortRating,
    sortTags,
    limit,
    offset,
  }
}) {
  // const users = await this.find()
  let docs = await this.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          // coordinates: [ 55.751640, 37.616565 ],
          // coordinates: [ 37.616565, 55.751640 ],
          coordinates: user.geoLoc.coordinates,
        },
        distanceField: "calculated",
        maxDistance: 25000000,
      }
    },
    {
      $addFields: { "likedTo": false },
    },
    {
      $addFields: { "likedFrom": false },
    },
    {
      $match: {
        isFilled: true,
        login: { $ne: user.login },
        // gender: +pref,
        // age: { $gt: +ageMin - 1, $lt: +ageMax + 1 },
        // rating: { $gt: +minRating - 1, $lt: +maxRating + 1 },
      }
    },
    {
      $skip: +offset,
    },
    {
      $limit: +limit,
    },
  ])

  docs = await Promise.all(docs.map(async userInQuery => {
    userInQuery.likedTo = await mongo.models.Actions.checkIfUserLikeMe(user, userInQuery)
    userInQuery.likedFrom = await mongo.models.Actions.checkIfILikeUser(user, userInQuery)
    return userInQuery
  }))

    // .select('-_id -salt -token -hashedPassword -__v -email -created')
  // let filteredDocs = docs


  // if (options.tags.length) {
  //   filteredDocs = filteredDocs.filter(
  //     (user) => options.tags.some((tag) => user.tags.includes(tag))
  //   )
  // }
  // filteredDocs.forEach((user) => {
  //   user.sortTags = user.tags.reduce((sum, tag) => {
  //     return sum += +options.tags.includes(tag)
  //   }, 0)
  // })
  // const sortFields = Object.keys(options.sortOrder)
  // const sortLen = sortFields.length
  // let i = 0
  // const compare = function(a, b, i) {
  //   const field = sortFields[i]
  //   return (i === sortLen)
  //     ? 0 : (
  //       options.sortOrder[field] * (a[field] - b[field]) ||
  //       compare(a, b, i + 1)
  //     )
  // }
  // filteredDocs = filteredDocs.sort((a, b) => compare(a, b, 0))
  // let res = {
  //   users: filteredDocs.slice(options.skip, options.skip + options.limit),
  //   length: filteredDocs.length,
  // }
  return { type: "ok", data: docs }
}