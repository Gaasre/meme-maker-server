const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');

const mongoDB = "mongodb://localhost:27017/mememaker";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Setup mongoose models
const Schema = mongoose.Schema;
const TemplateSchema = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
});
const Template = mongoose.model("Template", TemplateSchema, "template");

// Express server
const app = express();

app.use(cors())

const PORT = 1234;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Example Express Rest API endpoints
app.get("/meme-maker/api/memes", (req, res) => {
  Template.find({}, (err, doc) => {
    if (err) {
      res.send(err);
    }
    res.json(doc);
  });
});
app.post("/meme-maker/api/memes", (req, res) => {
  const memes = req.body;
  Template.collection.insert(memes, (err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.json({ success: true });
    }
  });
});

// Serve only the static files form the dist directory
app.use("/meme-maker/", express.static(__dirname + '/public'));

app.get("/meme-maker/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
