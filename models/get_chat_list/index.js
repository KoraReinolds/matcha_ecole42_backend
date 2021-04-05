module.exports = async function(req) {

  // let users = await this.find({ who: req.user._id})
  //   .lean()
  //   .populate('target', '-__v -salt -created -__v -token -_id -hashedPassword -email -tags -preference -location -isFilled -age -geoLoc -rating -biography -realLocation')
  //   .select('target action created -_id')
  //   .exec()
  console.log(req.user)

  console.log(await this.find({
    login: { $in: req.user.likeList },
  })

  .select('-_id -salt -token -hashedPassword -__v -email -created'))
  return {
    type: "ok",
    data: await this.find({
      login: { $in: req.user.likeList },
    })
    .select('-_id -salt -token -hashedPassword -__v -email -created')
  }



  // let filteredDocs = docs
  //   .filter((user) => user.likeList.includes(req.user.login))

  // callback(null, { type: "ok", message: "", data: filteredDocs })

}