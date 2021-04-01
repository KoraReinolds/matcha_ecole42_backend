const { sort } = require('../../dataGeneration/sentences')
const mongo = require('../../db/mongo')

module.exports = async function({
  user,
  query: {
    pref,
    ageMin,
    ageMax,
    radius,
    minRating,
    maxRating,
    tags,
    limit,
    skip,
    sort,
  }
}) {

  let docs = await this.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: user.geoLoc.coordinates,
        },
        distanceField: "distance",
        maxDistance: +radius * 1000,
        spherical: true,
      }
    },
    {
      $addFields: {
        dist: {
          $round: [{ $divide: ["$distance", 1000] }, 0]
        }
      },
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
        gender: { $in: pref || [] },
        age: { $gt: +ageMin - 1, $lt: +ageMax + 1 },
        rating: { $gt: +minRating - 1, $lt: +maxRating + 1 },
        ...(
          tags ? { tags: { $in: tags || [] } } : {}
        ),
      }
    },
    {
      $addFields: {
        tagsMatch: {
          $map: {
            input: "$tags",
            as: "tag",
            in: {
              $cond: {
                if: {
                  $in: [ "$$tag", tags ]
                },
                then: 1,
                else: 0
              }
            }
          }
        }
      }
    },
    {
      $addFields: {
        tagsCount: {
          $reduce: {
            input: "$tagsMatch",
            initialValue: 0,
            in: {
              $add : ["$$value", "$$this"],
            }
          }
        },
      }
    },
    {
      $sort: { ...JSON.parse(sort), empty: 1 }
    },
    {
      $skip: +skip
    },
    {
      $limit: +limit
    }
  ])

  docs = await Promise.all(docs.map(async userInQuery => {
    userInQuery.likedTo = await mongo.models.Actions.checkIfUserLikeMe(user, userInQuery)
    userInQuery.likedFrom = await mongo.models.Actions.checkIfILikeUser(user, userInQuery)
    return userInQuery
  }))

  return { type: "ok", data: docs }
}