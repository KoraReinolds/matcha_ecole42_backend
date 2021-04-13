module.exports = async function(req, target_user) {

  const notif = await this
    .find({
      who: req.user._id,
      target: target_user._id,
    })
    .sort({ _id: -1 })
    .limit(1)
    .lean()
    .populate('who', '-__v -salt -created -__v -token -_id -hashedPassword -email -tags -preference -location -isFilled -age -geoLoc -rating -biography -realLocation')
    .select('who action created -_id')
    .exec()

  req.app.get('io').sockets.emit(target_user.login, notif[0])
  
}