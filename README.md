node-red-contrib-telegrambot-switches
=====================================

Have a telegram bot ask questions, get responses, and continue the flow

## Getting Started

This assumes you have [node-red](http://nodered.org/) already installed and working.

```bash
cd ~/.node-red
npm install node-red-contrib-telegrambot-switches
sudo service nodered restart
```

## Included Nodes

You can view detailed documentation for the nodes via the node-red info pane. Just select a node and start readin'.

### telegram switch

Route messages based on a response from a user via Telegram

![](images/TelegramSwitchFlow.png?raw=true "Switch Flow")
![](images/TelegramSwitchBotMessage.png?raw=true "Telegram Message")

---
## Development

An environment with node-red can be easily spun up using Docker and Docker Compose.

1. Clone this repository:        `git clone https://github.com/scraton/node-red-contrib-telegrambot-switches`
1. Install node dependencies:    `cd node-red-contrib-telegrambot-switches && yarn install`
1. Start the docker environment: `yarn run dev`