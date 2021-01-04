const request = require("request").defaults({ encoding: null });

exports.url2data = function (url, callback) {
  request.get(url, (err, res, body) => {
    if (err || res.statusCode != 200) callback(err, null);
    return callback(null, body);
  });
};
