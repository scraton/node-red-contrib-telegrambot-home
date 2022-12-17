module.exports = function(RED) {
  var telegramBot = require("node-telegram-bot-api");

  function BotConfigNode(n) {
    RED.nodes.createNode(this, n);
    var node = this;

    this.botname = n.botname;
    this.status = "disconnected";
    this.usernames = (n.usernames) ? n.usernames.split(",").map(function(u){ return u.trim(); }) : [];
    this.chatIds = (n.chatIds) ? n.chatIds.split(",").map(function(id){ return parseInt(id); }) : [];
    this.pollInterval = parseInt(n.pollInterval);
    this.pollTimeout = parseInt(n.pollTimeout);
    this.nodes = [];

    if (isNaN(this.pollInterval)) {
      this.pollInterval = 300;
    }

    if (isNaN(this.pollTimeout)) {
      this.pollTimeout = 10;
    }

    this.getTelegramBot = function () {
      if (!this.telegramBot) {
        if (this.credentials) {
          this.token = this.credentials.token;

          if (this.token) {
            this.token = this.token.trim();

            var polling = {
              autoStart: true,
              interval: this.pollInterval,
              params: {
                timeout: this.pollTimeout,
              },
            };

            var options = {
              polling: polling
            };

            this.telegramBot = new telegramBot(this.token, options);
            node.status = "connected";

            this.telegramBot.on("error", function(error){
              node.warn(error.message);

              node.abortBot(error.message, function(){
                node.warn("Bot stopped: fatal error");
              });
            });

            this.telegramBot.on("polling_error", function(error){
              node.warn(error.message);

              var stopPolling = false;
              var hint;

              if (error.message == "ETELEGRAM: 401 Unauthorized") {
                hint = `Please check that your bot token is valid: ${node.token}`;
                stopPolling = true;
              } else if (error.message.includes("ETIMEDOUT")) {
                hint = "Timeout connecting to server. Trying again.";
              } else if (error.message.includes("ECONNRESET")) {
                hint = "Network connection may be down. Trying again.";
              } else if (error.message.includes("ENOTFOUND")) {
                hint = "Network connection may be down. Trying again.";
              } else if (error.message.includes("ECONNREFUSED")) {
                hint = "Server did not accept our connection.";
              } else {
                hint = "Unknown error. Trying again.";
              }

              if (stopPolling) {
                node.abortBot(hint, function(){
                  node.warn(`Bot stopped: ${error.message}`);
                });
              } else {
                node.warn(hint);
              }
            });

            this.telegramBot.on("webhook_error", function(error){
              node.warn(error.message);

              node.abortBot(error.message, function() {
                node.warn("Bot stopped: webhook error");
              })
            });
          }
        }
      }

      return this.telegramBot;
    };

    this.on("close", function(done){
      node.abortBot("closing", done);
    });

    this.abortBot = function(hint, done){
      function disableNode(n) {
        n.telegramBot = null;
        n.status = "disconnected";
        n.setNodeStatus({ fill: "red", shape: "ring", text: `bot stopped (${hint})`});
      }

      if (node.telegramBot !== null && node.telegramBot._polling) {
        node.telegramBot
          .stopPolling()
          .then(function(){
            node.nodes.forEach((n) => disableNode);
            disableNode(node);
            done();
          });
      } else {
        disableNode(node);
        done();
      }
    };

    this.isAuthorizedUser = function(user) {
      return (node.usernames.length === 0) || (node.usernames.indexOf(user) >= 0);
    };

    this.isAuthorizedChat = function(chatId) {
      return (node.chatIds.length === 0) || (node.chatIds.indexOf(chatId) >= 0);
    };

    this.isAuthorized = function(chatId, username) {
      var isAuthorizedUser = node.isAuthorizedUser(username);
      var isAuthroizedChat = node.isAuthorizedChat(chatId);

      return isAuthorizedUser && isAuthroizedChat;
    };

    this.register = function(n) {
      if (node.nodes.indexOf(n) === -1) {
        node.nodes.push(n);
      } else {
        node.warn(`Node ${n.id} registered more than once at the configuration node. Ignoring.`);
      }
    };

    this.setNodeStatus = function(status) {
      node.nodes.forEach(function(node){
        node.status(status);
      });
    };
  }

  RED.nodes.registerType("telegrambot-config", BotConfigNode, {
    credentials: {
      token: { type: "text" }
    }
  });
};
