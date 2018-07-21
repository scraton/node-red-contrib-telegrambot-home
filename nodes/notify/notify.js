var utils = require('../../lib/utils.js');

module.exports = function(RED) {
  function NotifyNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // Get base configuration
    this.bot = RED.nodes.getNode(config.bot);
    this.chatId = parseInt(config.chatId);
    this.parseMode = config.parseMode;
    this.staticMessage = config.message;

    // Initialize bot
    utils.initializeBot(node);

    // Verify inputs
    if (isNaN(this.chatId)) {
      this.chatId = null;
    }

    this.on("input", function(msg){
      if (!(node.staticMessage || msg.payload)) {
        utils.updateNodeStatusFailed(node, "message payload is empty");
        return;
      }

      if (!utils.validateChatId(node, msg)) {
        utils.updateNodeStatusFailed(node, "message has no chatID");
        return;
      }

      var chatId = node.chatId || msg.telegram.chat.id;
      var message = node.staticMessage || msg.payload;
      var chunkSize = 4000;
      var done = false;
      var messageToSend;
      var options = { parse_mode: node.parseMode };

      do {
        if (message.length > chunkSize) {
          messageToSend = message.substr(0, chunkSize);
          message = message.substr(chunkSize);
        } else {
          messageToSend = message;
          done = true;
        }

        node.telegramBot.sendMessage(chatId, messageToSend, options).then(function(sent){
          msg.telegram = { sentMessageId: sent.message_id };
          node.send(msg);
        });
      } while (!done);
    });

    this.on("close", function(){
      node.telegramBot.off("message");
      node.status({});
    });
  }

  RED.nodes.registerType("telegrambot-notify", NotifyNode);
};
