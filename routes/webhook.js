const express = require("express");
const router = express.Router();
const Twitter = require("twitter");
const Request = require("request");
const moment = require("moment-timezone");

require("dotenv").config();

const twitterConfig = {
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
};

console.log(twitterConfig);

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

  TT.post(
    "statuses/update",
    {
      status: `@naosalvo \nA Stream começou XET!\n
                \n${req.body.channelUrl}
                \n${req.body.game}`,
    },
    (error, tweet, response) => {
      if (error) throw error;
      else {
        res.json({
          statusCode: 200,
          statusMsg: "Postado no Twitter",
          time: tweet.created_at,
        });
      }
    }
  );
});

module.exports = router;
