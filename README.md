# ShrekBot

## A Slack Bot that Posts Random Lines from the Movie Shrek

## How Slack Bots Work
- Create an App on Slack [here](https://api.slack.com/apps)
- Create a bot for that App [guide](https://slack.com/help/articles/115005265703-Create-a-bot-for-your-workspace)
- Grab your API token from the OAuth & Permissions Page for your App (it will begin like "xoxb-")
- For your bot to respond to events (like mentions) you have to have a URL that can receive data POSTed to it
- Verify that you own that URL with Slack on the "Event Subscriptions" page or your App
- Subscribe to bot events (e.g. "app_mention" is the event name for when someone mentions your bot)
- Got to OAuth & Permissions to request permissions for your bot
- Every time you change permissions your App will have to be reinstalled (the Scopes section)
- Make sure your bot has sufficient permissions to do what you want it to do (read messages, write messages, etc)


## An Example of Data Sent to URL After "app_mention" Event
`
{
  token: '' /* censored */,
  team_id: 'TEAM_ID_HERE',
  api_app_id: 'API_APP_ID',
  event: {
    client_msg_id: 'c2acebcc-1eaa-4214-89aa-b4e28967d2f9',
    type: 'app_mention',
    text: '<@U01RW21U7DG> this is a test message!',
    user: 'U01S88GES7K',
    ts: '1616201941.005400',
    team: 'T01RNS9FTJA',
    blocks: [ [Object] ],
    channel: 'C01RVS1LDEX',
    event_ts: '1616201941.005400'
  },
  type: 'event_callback',
  event_id: 'Ev01SM8C556U',
  event_time: 1616201941,
  authorizations: [
    {
      ...
    }
  ],
  is_ext_shared_channel: false,
}

`
The most important parts here are:
- event.type
- event.text (what did the message say?)
- event.channel (what channel was it in?)

Then we post back what we want our bot to say:
`
    // API endpoint for bots to post
    const destination = 'https://slack.com/api/chat.postMessage';

    // the data we are sending to Slack
    const data = {
      token: token, // not sure if this needs to be here or if header is enough
      channel: channel,
      text: botResponse
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
`