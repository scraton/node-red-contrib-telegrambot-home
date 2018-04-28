module.exports = function(RED) {
  function SwitchNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // Get base configuration
    this.bot = RED.nodes.getNode(config.bot);
    this.chatId = parseInt(config.chatId);
    this.question = config.question || "";
    this.answers = config.answers || [];
    this.autoAnswerCallback = config.autoAnswerCallback;

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
      var question = this.question || msg.payload;
      var answers = this.answers || [];
      var chatId = this.chatId;

      if (question && answers.length > 0 && chatId) {
        var listener = function(botMsg){
          var username = botMsg.from.username;
          var chatId = botMsg.message.chat.id;
          var messageId = botMsg.message.message_id;
          var callbackQueryId = botMsg.id;

          if (botMsg.data && chatId === node.chatId && messageId === msg.telegram.messageId) {
            if (node.bot.isAuthorized(chatId, username)) {
              // Remove this listener since we got our reply
              node.telegramBot.removeListener("callback_query", listener);

              if (node.autoAnswerCallback) {
                // Answer the callback so progress can stop showing
                node.telegramBot.answerCallbackQuery(callbackQueryId).then(function(sent){
                  // nothing to do here
                });

                // Remove quick reply options
                node.telegramBot.editMessageReplyMarkup("{}", { chat_id: chatId, message_id: messageId }).then(function(sent){
                  // nothing to do here
                });
              }

              // Augment original message with additional Telegram info
              msg.telegram.callbackQueryId = callbackQueryId;

              // Continue with the original message
              var portCount = answers.length;
              var ports = new Array(portCount);
              var outputPort = parseInt(botMsg.data);

              for (var i = 0; i < portCount; i++) {
                ports[i] = null;
              }

              if (!isNaN(outputPort) && outputPort < portCount) {
                ports[outputPort] = msg;
                node.send(ports);
              } else {
                node.warn("invalid callback data received from telegram");
              }
            } else {
              node.warn("received callback was unauthorized");
            }
          } else {
            // This is not the listener you are looking for
          }
        };


        var chunkSize = 4000;
        var answerOpts = answers.map(function(answer, idx){
          return { text: answer, callback_data: idx };
        });
        var options = {
          reply_markup: {
            inline_keyboard: [answerOpts]
          }
        };

        if (question.length > chunkSize) {
          node.warn("Unable to send message, larger than chunk size. Shorten the payload and try again.");
        } else {
          node.telegramBot.sendMessage(chatId, question, options).then(function(sent){
            // Store sent message so we know how to respond later
            msg.telegram = { chatId: chatId, messageId: sent.message_id };
          });

          node.telegramBot.on("callback_query", listener);
        }
      }
    });

    this.on("close", function(){
      node.telegramBot.off("message");
      node.status({});
    });
  };

  RED.nodes.registerType("telegrambot-switch", SwitchNode);
};
