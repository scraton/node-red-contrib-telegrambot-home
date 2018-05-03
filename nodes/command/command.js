var utils = require('../../lib/utils.js');

module.exports = function(RED) {
  function CommandNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // Get base configuration
    this.bot = RED.nodes.getNode(config.bot);
    this.chatId = parseInt(config.chatId);
    this.command = config.command;

    // Initialize bot
    utils.initializeBot(node);

    // Verify inputs
    if (!this.chatId || isNaN(this.chatId)) {
      utils.updateNodeStatusFailed(node, "chat ID not provided");
      return;
    }

    if (!this.command || isEmpty(this.command)) {
      utils.updateNodeStatusFailed(node, "command is not provided");
      return;
    }

    if (node.telegramBot) {
      node.telegramBot.on('message', function(botMsg){
        var msg = { payload: botMsg };
        var chatId = botMsg.chat.id;
        var username = botMsg.from.username;

        if (node.bot.isAuthorized(chatId, username)) {
          if (matchedCommand(node.command, botMsg.text)) {
            node.send(msg);
          } else {
            // node.warn(`'${node.command}' did not match '${botMsg.text}'`);
          }
        } else {
          node.warn(`received unauthorized message in ${chatId} from '${username}'`);
        }
      });
    }

    this.on("close", function(){
      node.telegramBot.off("message");
      node.status({});
    });
  }

  function matchedCommand(a, b) {
    return a === b;
  }

  function isEmpty(str) {
    return (!str || /^\s*$/.test(str));
  }

  RED.nodes.registerType("telegrambot-command", CommandNode);
};
