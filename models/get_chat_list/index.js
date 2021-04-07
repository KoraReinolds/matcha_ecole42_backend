module.exports = async function(req) {

  return {
    type: "ok",
    data: await this.find(
      {
        login: { $in: req.user.likeList },
        likeList: { $in: [req.user.login] },
      }
    )
    .select('-_id -salt -token -hashedPassword -__v -email -created'),
  }
  
}