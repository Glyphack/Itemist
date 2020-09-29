function getCorsOptions(whitelist) {
  console.log(whitelist)
  return {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
}

module.exports = {getCorsOptions}
