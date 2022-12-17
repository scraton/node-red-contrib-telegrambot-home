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

```json
[{"id":"96c0e76d4d75681e","type":"tab","label":"Flow 3","disabled":false,"info":"","env":[]},{"id":"c5b1a542c41164aa","type":"telegrambot-switch","z":"96c0e76d4d75681e","name":"","bot":"1920d99f282aedbb","chatId":"1234","question":"Should I turn on the lights?","answers":["Yes","No","In 1 Hour"],"outputs":3,"autoAnswerCallback":true,"verticalAnswers":false,"timeoutValue":"","timeoutUnits":"","x":340,"y":260,"wires":[["03a75b3e19f06672"],["8b81ec18fe39d09b"],["ee0ce65c3a15eb3c"]]},{"id":"765f805efe882cab","type":"inject","z":"96c0e76d4d75681e","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":180,"y":260,"wires":[["c5b1a542c41164aa"]]},{"id":"03a75b3e19f06672","type":"debug","z":"96c0e76d4d75681e","name":"Yes","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":510,"y":220,"wires":[]},{"id":"8b81ec18fe39d09b","type":"debug","z":"96c0e76d4d75681e","name":"No","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":510,"y":260,"wires":[]},{"id":"ee0ce65c3a15eb3c","type":"delay","z":"96c0e76d4d75681e","name":"","pauseType":"delay","timeout":"1","timeoutUnits":"hours","rate":"1","nbRateUnits":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"allowrate":false,"outputs":1,"x":520,"y":300,"wires":[["e8a7b9772fcf257c"]]},{"id":"e8a7b9772fcf257c","type":"debug","z":"96c0e76d4d75681e","name":"In 1 Hour","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":540,"y":340,"wires":[]},{"id":"1920d99f282aedbb","type":"telegrambot-config","botname":"MyTelegramBot","usernames":"","chatIds":"","pollInterval":"300"}]
```

### notify

Send a notification to a user via Telegram

![](images/TelegramNotifyFlow.png?raw=true "Notify Flow")
![](images/TelegramNotifyBotMessage.png?raw=true "Telegram Message")

```json
[{"id":"96c0e76d4d75681e","type":"tab","label":"Flow 3","disabled":false,"info":"","env":[]},{"id":"765f805efe882cab","type":"inject","z":"96c0e76d4d75681e","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":180,"y":260,"wires":[["c5b1a542c41164aa"]]},{"id":"c5b1a542c41164aa","type":"telegrambot-switch","z":"96c0e76d4d75681e","name":"","bot":"1920d99f282aedbb","chatId":"1234","question":"Should I turn on the lights?","answers":["Yes","No"],"outputs":2,"autoAnswerCallback":true,"verticalAnswers":false,"timeoutValue":"","timeoutUnits":"","x":340,"y":260,"wires":[["03a75b3e19f06672","a9be69d1b8ee489e"],["8b81ec18fe39d09b","e7db54f753e221a8"]]},{"id":"03a75b3e19f06672","type":"debug","z":"96c0e76d4d75681e","name":"Yes","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":510,"y":180,"wires":[]},{"id":"8b81ec18fe39d09b","type":"debug","z":"96c0e76d4d75681e","name":"No","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","statusVal":"","statusType":"auto","x":510,"y":320,"wires":[]},{"id":"a9be69d1b8ee489e","type":"telegrambot-notify","z":"96c0e76d4d75681e","name":"","bot":"1920d99f282aedbb","chatId":"1234","message":"Ok, I've turn on the lights!","parseMode":"","x":540,"y":220,"wires":[]},{"id":"e7db54f753e221a8","type":"telegrambot-notify","z":"96c0e76d4d75681e","name":"","bot":"1920d99f282aedbb","chatId":"1234","message":"Ok, I'll leave them turned on.","parseMode":"","x":540,"y":360,"wires":[]},{"id":"1920d99f282aedbb","type":"telegrambot-config","botname":"MyTelegramBot","usernames":"","chatIds":"","pollInterval":"300"}]
```

### payload

Send an arbitrary payload via any available method to a user via Telegram

All of the [Telegram API methods](https://core.telegram.org/bots/api#available-methods) are available to you, either through the node properties or via dynamic payload generation.

#### Static

![](images/TelegramStaticPayloadFlow.png?raw=true "Static Payload Flow")
![](images/TelegramStaticPayloadNode.png?raw=true "Static Payload Node Properties")
![](images/TelegramStaticPayloadBotMessage.png?raw=true "Telegram Message")

```json
[{"id":"96c0e76d4d75681e","type":"tab","label":"Flow 3","disabled":false,"info":"","env":[]},{"id":"765f805efe882cab","type":"inject","z":"96c0e76d4d75681e","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":180,"y":260,"wires":[["43e1f1f799b44065"]]},{"id":"43e1f1f799b44065","type":"telegrambot-payload","z":"96c0e76d4d75681e","name":"","bot":"1920d99f282aedbb","chatId":"1234","sendMethod":"sendPhoto","payload":"{\n    \"photo\": \"https://i.imgur.com/O6zVEHF.jpg\",\n    \"caption\": \"Dingle Peninsula, Ireland\"\n}","x":370,"y":260,"wires":[["65f0f1d20bfbe98b"]]},{"id":"65f0f1d20bfbe98b","type":"debug","z":"96c0e76d4d75681e","name":"debug 1","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":560,"y":260,"wires":[]},{"id":"1920d99f282aedbb","type":"telegrambot-config","botname":"MyTelegramBot","usernames":"","chatIds":"","pollInterval":"300"}]
```

#### Dynamic

![](images/TelegramDynamicPayloadFlow.png?raw=true "Dynamic Payload Flow")
![](images/TelegramDynamicPayloadNode.png?raw=true "Dynamic Payload Function")
![](images/TelegramDynamicPayloadBotMessage.png?raw=true "Telegram Message")

```json
[{"id":"96c0e76d4d75681e","type":"tab","label":"Flow 3","disabled":false,"info":"","env":[]},{"id":"765f805efe882cab","type":"inject","z":"96c0e76d4d75681e","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":180,"y":260,"wires":[["80c368f988a30511"]]},{"id":"80c368f988a30511","type":"function","z":"96c0e76d4d75681e","name":"build payload","func":"msg.method = \"sendPhoto\";\nmsg.payload = {\n    photo: \"https://i.imgur.com/O6zVEHF.jpg\",\n    caption: \"Dingle Peninsula, Ireland\\n\\n\" +\n             \"Taken \" + msg.payload,\n};\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":220,"y":300,"wires":[["ec1f779423e3f179"]]},{"id":"ec1f779423e3f179","type":"telegrambot-payload","z":"96c0e76d4d75681e","name":"","bot":"1920d99f282aedbb","chatId":"1234","sendMethod":"","payload":"","x":430,"y":300,"wires":[["07fbb7e4d3d5a418"]]},{"id":"07fbb7e4d3d5a418","type":"debug","z":"96c0e76d4d75681e","name":"debug 1","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":620,"y":300,"wires":[]},{"id":"1920d99f282aedbb","type":"telegrambot-config","botname":"MyTelegramBot","usernames":"","chatIds":"","pollInterval":"300"}]
```

### command

Initiate a flow based on a command said in the chat

![](images/TelegramCommandFlow.png?raw=true "Command Flow")
![](images/TelegramCommandBotMessage.png?raw=true "Telegram Message")

Command nodes can also be configured for multi-chat flows. All other nodes are compatible and will route the message to the originating chat automatically. Simply leave the chat ID blank on the other nodes to enable this feature (and ensure the other chat IDs are authorized).

```json
[{"id":"96c0e76d4d75681e","type":"tab","label":"Flow 3","disabled":false,"info":"","env":[]},{"id":"f62e39f978116a30","type":"telegrambot-command","z":"96c0e76d4d75681e","name":"","bot":"1920d99f282aedbb","command":"Thank you","commandType":"str","commandCase":false,"x":150,"y":280,"wires":[["0735420b6e4f9948"]]},{"id":"0735420b6e4f9948","type":"telegrambot-notify","z":"96c0e76d4d75681e","name":"","bot":"1920d99f282aedbb","chatId":"","message":"You're welcome :)","parseMode":"","x":360,"y":280,"wires":[]},{"id":"1920d99f282aedbb","type":"telegrambot-config","botname":"MyTelegramBot","usernames":"","chatIds":"","pollInterval":"300"}]
```

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
