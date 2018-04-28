module.exports = function(RED) {
  function NotifyNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // Get base configuration
    this.bot = RED.nodes.getNode(config.bot);
    this.chatId = parseInt(config.chatId);
    this.staticMessage = config.message;

    if (this.bot) {
      this.bot.register(node);
      this.status({ fill: "red", shape: "ring", text: "disconnected" });

      node.telegramBot = this.bot.getTelegramBot();

      if (node.telegramBot) {
        this.status({ fill: "green", shape: "dot", text: "connected" });
      } else {
        node.warn("bot not initialized");
        this.status({ fill: "red", shape: "ring", text: "bot not initialized" });
      }
    } else {
      node.warn("config node failed to initialize");
      this.status({ fill: "red", shape: "ring", text: "config node failed to initialize" });
    }

    if (!this.chatId || isNaN(this.chatId)) {
      node.warn("chat ID not provided");
      this.status({ fill: "red", shape: "ring", text: "chat ID not provided" });
    }

    this.on("input", function(msg){
      if (!(node.staticMessage || msg.payload)) {
        node.warn('message payload is empty');
      } else if (!node.chatId) {
        node.warn('chatId is empty');
      } else {
        var message = node.staticMessage || msg.payload;
        var chunkSize = 4000;
        var done = false;
        var messageToSend;

        do {
          if (message.length > chunkSize) {
            messageToSend = message.substr(0, chunkSize);
            message = message.substr(chunkSize);
          } else {
            messageToSend = message;
            done = true;
          }

          node.telegramBot.sendMessage(node.chatId, messageToSend, msg.payload.options).then(function(sent){
            msg.telegram = { sentMessageId: sent.message_id };
            node.send(msg);
          });
        } while (!done);
      }
    });

    this.on("close", function(){
      node.telegramBot.off("message");
      node.status({});
    });
  }

  RED.nodes.registerType("telegrambot-notify", NotifyNode);
};
