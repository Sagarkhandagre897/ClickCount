console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();

// serve files from the public directory
app.use(express.static('public'));

// connect to the db and start the express server
// connect to the db and start express server
let db;

const url = "mongodb://localhost:27017";

MongoClient.connect(url, { connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 5000, }, (err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db("ClickCounts");
  // start the express web server listening on 8080

  const PORT  = process.env.PORT || 8080;

  app.listen(PORT  , () => {
    console.log("listening on 8080");
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// add a document to the DB collection recording the click event
app.post('/clicked', (req, res) => {
  const click = {clickTime: new Date()};
  console.log(click);
  console.log(db);

  db.collection('clicks').save(click, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('click added to db');
    res.sendStatus(201);
  });
});

// get the click data from the database
app.get('/clicks', (req, res) => {
  db.collection('clicks').find().toArray((err, result) => {
    if (err) return console.log(err);
    res.send(result);
  });
});