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

// the icon to use for the bot
const iconUrl = 'https://pbs.twimg.com/profile_images/614015829152141312/e0PishrG_400x400.jpg';

app.post('/shrek', function(req, res, next) {
  let payload = req.body;
  // This has to run when you first set it up
  // Slack sends a message to the URL you provide to make sure you control it
  if (payload.type === 'url_verification') {
    res.send(payload.challenge);
  }

  // rooms have weird IDs
  const ROOM_COLLEEN = 'C01RSPRDZHT';

  // get the text in the user's message
  const textPosted = payload.event.text;
  // what is the id of the channel where the event took place?
  const channel = payload.event.channel;

  // thread
  const thread = payload.event.ts;

  // the Slack API endpoint
  const destination = 'https://slack.com/api/chat.postMessage';

  // set the header so we are authorized
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  // defualt response is a random line from Shrek 1
  const defaultResponse = '*Line from Shrek 1*\n>"' + randomLineFromShrek1() + '"';

  // the data we are sending to Slack
  const data = {
    token: token,
    channel: channel,
    text: defaultResponse,
    icon_url: iconUrl
  };

  if (payload.event.type === 'app_mention') {
    // if the bot was mentioned
    // "app_mention" event

    // stringify data
    const stringifiedData = qs.stringify(data);

    // let it fly!
    axios.post(destination, stringifiedData, { headers: headers })
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((err) => {
        // only visible if you're watching on the server terminal
        console.log(err);
      });

  } else if (payload.event.type === 'message') {
    // someone posted something in a public channel
    // bot will respond only under certain conditions

    // if the channel was Colleen's Channel
    if (channel === ROOM_COLLEEN) {
      // and someone mentions boys
      if (textPosted.toLowerCase().includes('boy') ) {
        data.text = '*NO BOYS ALLOWED*';
        return axios.post(destination, qs.stringify(data), { headers })
          .then((result) => { res.sendStatus(200); })
          .catch((err) => { console.log(err); });
      }
    }

    if (textPosted.toLowerCase().includes('sdc')) {
      data.text = 'Take a break from SDC and watch Shrek';
      data.thread_ts = thread;
      return axios.post(destination, qs.stringify(data), { headers })
        .then((result) => { res.sendStatus(200); })
        .catch((err) => { console.log(err); });
    }

    if (textPosted.toLowerCase().includes('mongo')) {
      data.text = 'Mongo? More like bongo if you ask me!';
      data.thread_ts = thread;
      return axios.post(destination, qs.stringify(data), { headers })
        .then((result) => { res.sendStatus(200); })
        .catch((err) => { console.log(err); });
    }

  } else {
    // if it was not a bot "app_mention" event, just send a 200 back
    res.sendStatus(200);
  }
});

app.get('/', function(req, res) {
  res.send('Hello shrek world');
});


module.exports = app;
