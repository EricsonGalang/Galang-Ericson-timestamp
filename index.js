// index.js
// where your node app starts

// init project
var express = require('express');
var path = require('path');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const isInvalidDate = (date) => date.toUTCString() === "Invalid Date";

// Return current time if no date parameter is supplied
const handleCurrent = (req, res) => {
  const now = new Date();
  res.json({
    unix: now.getTime(),
    utc: now.toUTCString()
  });
};

app.get(["/api", "/api/", "/api/timestamp", "/api/timestamp/"], handleCurrent);

// Parse date string or unix timestamp
const handleDate = (req, res) => {
  let date = new Date(req.params.date);

  if (isInvalidDate(date)) {
    date = new Date(+req.params.date);
  }

  if (isInvalidDate(date)) {
    res.json({ error: "Invalid Date" });
    return;
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
};

app.get(["/api/:date", "/api/timestamp/:date"], handleDate);

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, '0.0.0.0', function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;
