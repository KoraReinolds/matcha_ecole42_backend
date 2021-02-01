module.exports = async function(req) {

  let users = await this.find({ who: req.user._id})
    .lean()
    .populate('target', '-__v -salt -created -__v -token -_id -hashedPassword -email -tags -preference -location -isFilled -age -geoLoc -rating -biography -realLocation')
    .select('target action created -_id')
    .exec()
    
  users = users.map(({ target, action: type, created: time }) => {
    const user = {
      ...target,
      images: target.images.find(img => img.avatar).src,
      type,
      time
    }
    return user
  })

  return { type: "ok", data: users }

}