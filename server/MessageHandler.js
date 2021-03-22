import CHANNELS from './data/channels.js';
import postMessage from './postMessage.js';
import BASIC_DATA from './data/basics.js';

class MessageHandler {

  constructor(event) {
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

  }

  // does the message text include "searchText"?
  textIncludes(searchText) {
    return this.text.toLowerCase().includes(searchText);
  }

  // does the message text include at least one of strings in "searchTerms"?
  textIncludesAny(searchTerms) {
    if (!Array.isArray(searchTerms)) {
      return false;
    }
    return searchTerms.some(term => {
      return this.text.toLowerCase().includes(term);
    });
  }

  getChannelName() {
    return this.channel.name;
  }

  sendResponse(responseText) {
    this.data.text = responseText;
    postMessage(this.data);
    return true;
  }

}

export defualt MessageHandler;