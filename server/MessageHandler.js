const CHANNELS = require('./data/channels.js');
const postMessage = require('./post-message.js');
const BASIC_DATA = require('./data/basics.js');

class MessageHandler {

  constructor(event, res) {
    this.type = 'message';
    this.channel = CHANNELS.find(c => c.id === event.channel);
    this.text = event.text;
    this.wasBot = event.hasOwnProperty('bot_id');
    this.data = {
      token: process.env.SLACK_TOKEN,
      channel: this.channel.id,
      text: '',
      icon_url: BASIC_DATA.botIconUrl
    }
    this.res = res;
    console.log(this.data);
  }

  handleMessage() {
    // first things first
    if (this.getChannelName() === 'colleens-channel-no-boys') {
      return this.sendResponse('NO BOYS ALLOWED');
    }

    // check to see if person is from Boston
    let bostonWords = ['boston', 'wicked', 'townie', 'the cape', 'packie', 'bubbler', 'matt damon', 'ben af', 'bubblah', 'the hub', 'no suh', 'pahlah', 'parlor', 'dunks', 'the T ', 'on the pike', 'chowder', 'chowd', 'masshole', 'tonic'];
    if (this.textIncludesAny(bostonWords)) {
      return this.sendResponse('You from Boston? I suppose you think you\'re better than me?');
    }

    this.res.sendStatus(200);
  }

  // does the message text include "searchText"?
  textIncludes(searchText) {
    return this.text.toLowerCase().includes(searchText);
  }

  // does the message text include at least one of strings in "searchTerms"?
  textIncludesAny(searchTerms) {
    for (let i = 0; i < searchTerms.length; i++) {
      let term = searchTerms[i];
      if (this.textIncludes(term)) {
        return true;
      }
    }
    return false;
  }

  getChannelName() {
    return this.channel.name;
  }

  sendResponse(responseText) {
    console.log('trying to send response');
    console.log(responseText);
    this.data.text = responseText;
    postMessage(this.data);
    return true;
  }

}

module.exports = MessageHandler;
