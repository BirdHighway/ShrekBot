const axios = require('axios');
const qs = require('qs');
const BASIC_DATA = require('./data/basics.js');

const postMessage = function(data) {
  const destination = BASIC_DATA.postMessageEndpoint;
  const token = process.env.SLACK_TOKEN;
  // set the header so we are authorized
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  axios.post(destination, qs.stringify(data), { headers })
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = postMessage;
