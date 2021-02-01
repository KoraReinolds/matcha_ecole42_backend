module.exports = async function(req) {

  let users = await this.find({ who: req.user._id})
    .lean()
    .populate('who', '-__v -salt -created -__v -token -_id -hashedPassword -email -tags -preference -location -isFilled -age -geoLoc -rating -biography -realLocation')
    .select('who action created -_id')
    .exec()
    
  users = users.map(({ who, action: type, created: time }) => {
    const user = {
      ...who,
      images: who.images.find(img => img.avatar).src,
      type,
      time
    }
    return user
  })
  
  return { type: "ok", data: users }

}