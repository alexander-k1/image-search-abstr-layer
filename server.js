// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const request = require('request');

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html


const CONNECTION_STRING = process.env.DB;
const key = process.env.PIXABAY_KEY;

function processResult(result) {
  return result.map(function(item) {
    return {"largeImageURL": item.largeImageURL, "pageURL": item.pageURL, "tags": item.tags};
  })
};

MongoClient.connect(CONNECTION_STRING, function(err, db) {
  if(err) {
    console.log('Database error: ' + err);
  } else {
    app.get("/", function(request, response) {
      response.sendFile(__dirname + "/views/index.html");
    });
    app.get("/api/latest/imagesearch/", function(req, res) {
      db.db().collection('searchresults').findOne({name: "searcharray"}, (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          res.send(doc.arr);
        }
      })
    });
    app.get("/api/imagesearch/:term", function(req, res) {
      let term = req.params.term;
      term = encodeURIComponent(term);
      let offset;
      if (req.query.offset) {
        offset = req.query.offset;
      }
      var url = `https://pixabay.com/api/?key=${key}&q=${term}`;
      if (offset) {
        url += `&page=${offset}`;
      }
      db.db().collection('searchresults').findOne({name: "searcharray"}, (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          const modArr = doc.arr;
          if (modArr.length === 10) {
            modArr.unshift({"term": term, "date": (new Date()).toISOString()});
            modArr.pop();
          } else {
            modArr.unshift({"term": term, "date": (new Date()).toISOString()});
          }
          db.db().collection('searchresults').findOneAndUpdate({name: "searcharray"}, {$set: {arr: modArr}}, (err, doc) => {
            if (err) {
              console.log(err);
            } else {
              request.get(url, function(err, response, body) {
                if (err) {
                  console.log(err);
                }
                const result = JSON.parse(body);
                res.send(processResult(result.hits));
              })
            }
          });
        }
      });
    });
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
