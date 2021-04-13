module.exports = async function(req) {

  await this.updateMany({ target: req.user._id }, { readed: true })

  return { type: "ok", data: await this
    .find({ target: req.user._id })
    .lean()
    .populate('who', '-__v -salt -created -__v -token -_id -hashedPassword -email -tags -preference -location -isFilled -age -geoLoc -rating -biography -realLocation')
    .select('who action created -_id')
    .sort({ _id: -1 })
    .exec()
}

}