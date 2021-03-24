import postMessage = require('./post-message.js');

// the icon to use for the bot
const iconUrl = 'https://pbs.twimg.com/profile_images/614015829152141312/e0PishrG_400x400.jpg';

const channel = 'C01RVLP5GCS';

const data = {
  token: process.env.SLACK_TOKEN,
  channel: channel,
  icon_url: iconUrl,
  text: ''
}

function getRandomMessage() {
  return `/giphy [happy birthday] \nHappy Birthday Phil!`;
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