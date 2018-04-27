module.exports = function(RED) {
  function SwitchNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // Get base configuration
    this.bot = RED.nodes.getNode(config.bot);
    this.question = config.question || "";
    this.answers = config.answers || [];

    if (this.bot) {
      this.bot.register(node);
      this.status({ fill: 'red', shape: 'ring', text: 'disconnected' });

      node.telegramBot = this.bot.getTelegramBot();

      if (node.telegramBot) {
        this.status({ fill: 'green', shape: 'dot', text: 'connected' });
      } else {
        node.warn('bot not initialized');
        this.status({ fill: 'red', shape: 'ring', text: 'bot not initialized' });
      }
    } else {
      node.warn('config node failed to initialize');
      this.status({ fill: 'red', shape: 'ring', text: 'config node failed to initialize' });
    }

    this.on('close', function(){
      node.telegramBot.off('message');
      node.status({});
    });
  };

  RED.nodes.registerType('telegrambot-switch', SwitchNode);
};
