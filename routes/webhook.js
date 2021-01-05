const express = require("express");
const router = express.Router();
const Twitter = require("twitter");

const { url2data } = require("../functions/url2data");
const strings = require("../strings/strings");

require("dotenv").config();

const twitterConfig = {
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
};

const TT = new Twitter(twitterConfig);

const authConfig = {
  auth: true,
  token: process.env.AUTH_TOKEN,
};

const validation = (req, res, next) => {
  let { auth } = req.body;

  if (!authConfig.auth || auth === authConfig.token) next();
  else
    return res.json({
      statusCode: 401,
      statusMsg: "Invalid Token",
    });
};

router.get("/status", (req, res) => {
  res.json({
    statusCode: 200,
    statusMsg: "To Online",
  });
});

router.post("/on", validation, (req, res) => {
  console.log(`Tá online: ${req.body.game}, ${Date.now()}`);

  url2data(req.body.streamPreview, (err, data) => {
    if (err) return res.json({ message: "Error on url2Data", error: err });

    TT.post(
      "media/upload",
      { media: data },
      (mediaErr, mediaTweet, mediaRes) => {
        if (mediaErr) {
          return res.json({
            message: "Error on media upload",
            error: mediaErr,
            res: mediaRes,
          });
        }

        const status = {
          status: `${
            strings[Math.floor(Math.random() * strings.length)]
          }\n@naosalvo 🔥\n
                  \n${req.body.channelUrl}
                  \n${req.body.game}`,
          media_ids: mediaTweet.media_id_string,
        };

        TT.post("statuses/update", status, (statusErr, tweet, response) => {
          if (statusErr) {
            return res.json({
              message: "Error on statuses/update",
              error: statusErr,
            });
          } else {
            res.json({
              statusCode: 200,
              statusMsg: "Postado no Twitter",
              time: tweet.created_at,
            });
          }
        });
      }
    );
  });
});

module.exports = router;
