const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const app = express();
const MessageHandler = require('./MessageHandler.js');
const postMessage = require('./post-message.js');
const wishPhilHappyBirthday = require('./phil.js');

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

wishPhilHappyBirthday();

// the "dotenv" package loads all values in .env file into the global variable process.env
const token = process.env.SLACK_TOKEN;

// the icon to use for the bot
const iconUrl = 'https://pbs.twimg.com/profile_images/614015829152141312/e0PishrG_400x400.jpg';

app.post('/shrek', function(req, res, next) {
  let payload = req.body;
  // This has to run when you first set it up
  // Slack sends a message to the URL you provide to make sure you control it
  if (payload.type === 'url_verification') {
    return res.send(payload.challenge);
  }

  return res.sendStatus(200);

  // defualt response is a random line from Shrek 1
  const defaultResponse = '*Line from Shrek 1*\n>"' + randomLineFromShrek1() + '"';
  const channel = payload.channel;
  // the data we are sending to Slack
  const data = {
    token: token,
    channel: channel,
    text: defaultResponse,
    icon_url: iconUrl
  };

  // avoid ShrekBot replying to himself in an infinite loop (oops!)
  if (payload.event.hasOwnProperty('username') && payload.event.username === 'ShrekBot') {
    return;
  }

  if (payload.event.type === 'app_mention') {
    // if the bot was mentioned
    // "app_mention" event
    return sendResponse(data, headers);
  }

  if (payload.event.type === 'message') {
    // someone posted something in a public channel
    // bot will respond only under certain conditions

    // view MessageHandler.js to see program logic
    const messageHandler = new MessageHandler(payload.event);
    return messageHandler.handleMessage();
  }

});

app.get('/', function(req, res) {
  res.send('Hello shrek world');
});


module.exports = app;
