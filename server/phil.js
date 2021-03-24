postMessage = require('./post-message.js');
const fs = require('fs');

// the icon to use for the bot
const iconUrl = 'https://pbs.twimg.com/profile_images/614015829152141312/e0PishrG_400x400.jpg';

const channel = 'C01RVLP5GCS';

const data = {
  token: process.env.SLACK_TOKEN,
  channel: channel,
  icon_url: iconUrl,
  text: ''
}

const script = fs.readFileSync(fileName, {encoding: 'utf8', flag: 'r'});
const lines = script.split("\n");
const numLines = lines.length;

function randomLineFromShrek1() {
  let i = Math.floor(Math.random() * numLines);
  return lines[i];
}

function getRandomMessage() {
  let line = randomLineFromShrek1();
  return `Happy Birthday Phil!\n${line}`;
}

function randomLengthOfTime() {
  return Math.random() * 1000 * 120;
}

const wishPhilHappyBirthday = function () {
  data.text = getRandomMessage();
  postMessage(data);
  let wait = randomLengthOfTime();
  setTimeout(() => {
    wishPhilHappyBirthday();
  }, wait);
}

module.exports = wishPhilHappyBirthday;