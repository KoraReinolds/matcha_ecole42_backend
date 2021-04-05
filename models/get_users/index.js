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
    tags=[],
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
      $match: {
        isFilled: true,
        login: { $ne: user.login },
        gender: { $in: pref || [] },
        age: { $gt: +ageMin - 1, $lt: +ageMax + 1 },
        rating: { $gt: +minRating - 1, $lt: +maxRating + 1 },
        tags: tags.length ? { $in: tags } : { $nin: tags }
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
    },
    {
      $addFields: { likedTo: { $in: [user.login, "$likeList"] } },
    },
    {
      $addFields: { likedFrom: { $in: ["$login", user.likeList] } },
    },
  ])

  return { type: "ok", data: docs }
}