const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var Config = {};

const Port = process.env.PORT || 5000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/cidcibot", require("./routes/webhook"));

app.listen(Port, () => console.log(`Rodando na porta [${Port}]`));
