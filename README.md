node-red-contrib-telegrambot-home
=====================================

Useful nodes for connecting your home to Telegram.

## Getting Started

This assumes you have [node-red](http://nodered.org/) already installed and working.

```bash
cd ~/.node-red
npm install node-red-contrib-telegrambot-home
sudo service nodered restart
```

## Telegram Bot Setup

You will need to setup a Telegram bot in order to use these nodes. You can follow [these instructions](https://core.telegram.org/bots#6-botfather) for how to do it. In summary:

1. **Create the bot:** Send BotFather the message `/newbot`
1. **Name the bot:** Give it any name. This is how you will see it in Telegram.
1. **Give the bot a username:** Must be unique. Doesn't have to match the bot's name.
1. **Grab the token:** You will need this for configuring the nodes.
1. **Send the bot a message:** Just say hi or click the start button in the chat window.
1. **Grab the chat ID:** `curl "https://api.telegram.org/bot${TOKEN}/getUpdates"` replacing `${TOKEN}` with your bot token.

You will get a JSON response like the following:

```json
{"ok":true,"result":[{"update_id":123456,
"message":{"message_id":1,"from":{"id":123,"is_bot":false,"first_name":"Your","last_name":"Name","language_code":"en-US"},"chat":{"id":987654321,"first_name":"Your","last_name":"Name","type":"private"},"date":12345678,"text":"/start"}}]}
```

In this example, the chat ID is `987654321`.

If you get an empty response, try sending the bot another message. If it's still empty, make sure the bot is not in use by another application (or node) as it will consume the message before you can grab the ID.

If you wish to send messages to multiple chats, you will need to repeat the steps for grabbing each individual chat ID. Sending messages to a group has not been tested, but should be similar to the above steps.

You can then use the token and chat ID to configure the nodes.

## Included Nodes

You can view detailed documentation for the nodes via the node-red info pane. Just select a node and start readin'.

* [switch](#switch)
* [notify](#notify)
* [payload](#payload)
* [command](#command)

### switch

Route messages based on a response from a user via Telegram

![](images/TelegramSwitchFlow.png?raw=true "Switch Flow")
![](images/TelegramSwitchBotMessage.png?raw=true "Telegram Message")

### notify

Send a notification to a user via Telegram

![](images/TelegramNotifyFlow.png?raw=true "Notify Flow")
![](images/TelegramNotifyBotMessage.png?raw=true "Telegram Message")

### payload

Send an arbitrary payload via any available method to a user via Telegram

All of the [Telegram API methods](https://core.telegram.org/bots/api#available-methods) are available to you, either through the node properties or via dynamic payload generation.

#### Static

![](images/TelegramStaticPayloadFlow.png?raw=true "Static Payload Flow")
![](images/TelegramStaticPayloadNode.png?raw=true "Static Payload Node Properties")
![](images/TelegramStaticPayloadBotMessage.png?raw=true "Telegram Message")

#### Dynamic

![](images/TelegramDynamicPayloadFlow.png?raw=true "Dynamic Payload Flow")
![](images/TelegramDynamicPayloadNode.png?raw=true "Dynamic Payload Function")
![](images/TelegramDynamicPayloadBotMessage.png?raw=true "Telegram Message")

### command

Initiate a flow based on a command said in the chat

![](images/TelegramCommandFlow.png?raw=true "Command Flow")
![](images/TelegramCommandBotMessage.png?raw=true "Telegram Message")

Command nodes can also be configured for multi-chat flows. All other nodes are compatible and will route the message to the originating chat automatically. Simply leave the chat ID blank on the other nodes to enable this feature (and ensure the other chat IDs are authorized).

---
## Development

An environment with node-red can be easily spun up using Docker and Docker Compose.

1. Clone this repository:        `git clone https://github.com/scraton/node-red-contrib-telegrambot-home`
1. Install node dependencies:    `cd node-red-contrib-telegrambot-home && yarn install`
1. Start the docker environment: `yarn run dev`

---
## Credits

Gotta give credit where credit is due.

* [node-red](https://github.com/node-red/node-red)
* [node-red-contrib-home-assistant](https://github.com/AYapejian/node-red-contrib-home-assistant)
* [node-red-contrib-telegrambot](https://github.com/windkh/node-red-contrib-telegrambot)
* [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
