module.exports = async function(req) {

  let users = await this.find({ target: req.user._id})
    .lean()
    .populate('who', '-__v -salt -created -__v -token -_id -hashedPassword -email -tags -preference -location -isFilled -age -geoLoc -rating -biography -realLocation')
    .select('who action created -_id')
    .exec()

  return { type: "ok", data: users }

}