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

## Included Nodes

You can view detailed documentation for the nodes via the node-red info pane. Just select a node and start readin'.

### switch

Route messages based on a response from a user via Telegram

![](images/TelegramSwitchFlow.png?raw=true "Switch Flow")
![](images/TelegramSwitchBotMessage.png?raw=true "Telegram Message")

### notify

Send a notification to a user via Telegram

![](images/TelegramNotifyFlow.png?raw=true "Notify Flow")
![](images/TelegramNotifyBotMessage.png?raw=true "Telegram Message")

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
