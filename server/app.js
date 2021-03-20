const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const app = express();

// load environment variable from .env
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


const fileName = '/home/ubuntu/ShrekBot/shrek-1.txt';
const script = fs.readFileSync(fileName, {encoding: 'utf8', flag: 'r'});
const lines = script.split("\n");
const numLines = lines.length;

function randomLineFromShrek1() {
  let i = Math.floor(Math.random() * numLines);
  return lines[i];
}

// the "dotenv" package loads all values in .env file into the global variable process.env
const token = process.env.SLACK_TOKEN;

app.post('/shrek', function(req, res, next) {
  let payload = req.body;
  // This has to run when you first set it up
  // Slack sends a message to the URL you provide to make sure you control it
  if (payload.type === 'url_verification') {
    res.send(payload.challenge);
  }

  // rooms have weird IDs
  const ROOM_COLLEEN = 'C01RSPRDZHT';

  // if the bot was mentioned
  // "app_mention" event
  if (payload.event.type === 'app_mention') {
    // get the text in the user's message
    const textPosted = payload.event.text;
    // what is the id of the channel the bot was mentioned in?
    const channel = payload.event.channel;

    // default response? a random line from Shrek 1
    var botResponse = '"' + randomLineFromShrek1() + '"';

    // if the channel was Colleen's Channel, no boys are allowed!
    if (channel === ROOM_COLLEEN) {
      if (textPosted.toLowerCase().includes('boy') ) {
        text = 'NO BOYS ALLOWED';
      }
    }

    const destination = 'https://slack.com/api/chat.postMessage';

    // the data we are sending to Slack
    const data = {
      token: token,
      channel: channel,
      text: text
    };
    const stringifiedData = qs.stringify(data);

    // set the header so we are authorized
    const headers = {
      'Authorization': `Bearer ${token}`
    };


    // let it fly!
    axios.post(destination, stringifiedData, { headers: headers })
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((err) => {
        // only visible if you're watching on the server terminal
        console.log('error');
        console.log(err);
      });
    } else {
      // if it was not a bot "app_mention" event, just send a 200 back
      res.sendStatus(200);
    }
});

app.get('/', function(req, res) {
  res.send('Hello shrek world');
});


module.exports = app;
