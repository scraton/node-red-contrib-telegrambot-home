var utils = require('../../lib/utils.js');

module.exports = function(RED) {
  function SwitchNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // Get base configuration
    this.bot = RED.nodes.getNode(config.bot);
    this.chatId = parseInt(config.chatId);
    this.question = config.question || "";
    this.answers = config.answers || [];
    this.timeoutValue = config.timeoutValue || null;
    this.timeoutUnits = config.timeoutUnits || null;
    this.timeoutCallback = null;
    this.autoAnswerCallback = config.autoAnswerCallback;
    this.verticalAnswers = config.verticalAnswers;

    // Initialize bot
    utils.initializeBot(node);

    // Verify inputs
    if (isNaN(this.chatId)) {
      this.chatId = null;
    }

    if (this.timeoutValue !== null) {
      if (this.timeoutUnits === null) {
        utils.updateNodeStatusFailed(node, "timeout units not provided");
        return;
      }

      this.timeoutDuration = utils.timeUnits(parseInt(this.timeoutValue, 10), this.timeoutUnits);

      if (this.timeoutDuration === NaN) {
        utils.updateNodeStatusFailed(node, "timeout not parsable");
        return;
      }

      if (this.timeoutDuration <= 0) {
        utils.updateNodeStatusFailed(node, "timeout should be greater than 0");
        return;
      }
    }

    // Compute output ports
    var portCount = (this.timeoutValue === null) ? this.answers.length : this.answers.length + 1;
    var ports = new Array(portCount);

    for (var i = 0; i < portCount; i++) {
      ports[i] = null;
    }

    this.on("input", function(msg){
      if (!utils.validateChatId(node, msg)) {
        utils.updateNodeStatusFailed(node, "message has no chatID");
        return;
      }

      var chatId = node.chatId || msg.telegram.chat.id;
      var question = node.question || msg.payload;
      var answers = node.answers || [];

      if (question && answers.length > 0) {
        var listener = function(botMsg){
          var username = botMsg.from.username;
          var fromChatId = botMsg.message.chat.id;
          var messageId = botMsg.message.message_id;
          var callbackQueryId = botMsg.id;

          if (botMsg.data && fromChatId === chatId && messageId === msg.telegram.messageId) {
            if (node.bot.isAuthorized(chatId, username)) {
              // Remove this listener since we got our reply
              node.telegramBot.removeListener("callback_query", listener);

              // Clear the timeout
              if (node.timeoutCallback) {
                clearTimeout(node.timeoutCallback);
              }

              // Update node status
              utils.updateNodeStatusSuccess(node);

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
              var outPorts = ports.slice(0);
              var outputPort = parseInt(botMsg.data);

              if (!isNaN(outputPort) && outputPort < portCount) {
                outPorts[outputPort] = msg;
                node.send(outPorts);
              } else {
                node.warn("invalid callback data received from telegram");
              }
            } else {
              node.warn(`received callback in ${chatId} from '${username}' was unauthorized`);
            }
          } else {
            // This is not the listener you are looking for
          }
        };

        var timeoutListener = function(sentMsg){
          utils.updateNodeStatus(node, "yellow", "dot", "timed out waiting for reply");

          // Remove this listener
          node.telegramBot.removeListener("callback_query", listener);

          var messageId = sentMsg.message_id;
          var sentChatId = sentMsg.chat.id;

          // Remove reply keyboard from message
          if (messageId && sentChatId) {
            node.telegramBot.editMessageReplyMarkup("{}", { chat_id: sentChatId, message_id: messageId }).then(function(sent){
              // nothing to do here
            });
          }

          // output to timeout
          var outPorts = ports.slice(0);
          var outputPort = portCount - 1;
          outPorts[outputPort] = msg;
          node.send(outPorts);
        };


        var chunkSize = 4000;
        var answerOpts = answers.map(function(answer, idx){
          var answer = { text: answer, callback_data: idx };
          return node.verticalAnswers ? [answer] : answer;
        });
        var options = {
          reply_markup: {
            inline_keyboard: node.verticalAnswers ? answerOpts : [answerOpts]
          }
        };

        if (question.length > chunkSize) {
          utils.updateNodeStatusFailed(node, "message larger than allowed chunk size");
        } else {
          node.telegramBot.sendMessage(chatId, question, options).then(function(sent){
            // Store sent message so we know how to respond later
            msg.telegram = sent;
            msg.telegram.chatId = chatId; // deprecated
            msg.telegram.messageId = sent.message_id; // deprecated

            if (node.timeoutDuration > 0) {
              node.timeoutCallback = setTimeout(function(){
                timeoutListener(sent);
              }, node.timeoutDuration);
              utils.updateNodeStatusPending(node, `waiting for reply (${node.timeoutValue}${node.timeoutUnits})`);
            } else {
              utils.updateNodeStatusPending(node, "waiting for reply");
            }
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
