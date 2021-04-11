module.exports = async function(req) {

  return {
    type: "ok",
    data: await this.find(
      {
        target: req.user._id,
        readed: false,
      }
    )
    .count()
  }
  
}