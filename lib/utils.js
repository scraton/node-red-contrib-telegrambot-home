function initializeBot(node, bot) {
  if (node.bot) {
    node.bot.register(node);
    updateNodeStatus(node, "red", "ring", "disconnected");

    node.telegramBot = node.bot.getTelegramBot();

    if (node.telegramBot) {
      updateNodeStatusSuccess(node);
    } else {
      updateNodeStatusFailed(node, "bot not initialized");
    }
  } else {
    updateNodeStatusFailed(node, "config node failed to initialize");
  }
}

function updateNodeStatus(node, fill, shape, msg) {
  node.status({ fill: fill, shape: shape, text: msg });
}

function updateNodeStatusSuccess(node, msg="connected") {
  updateNodeStatus(node, "green", "dot", msg);
}

function updateNodeStatusFailed(node, msg) {
  node.warn(msg);
  updateNodeStatus(node, "red", "ring", msg);
}

module.exports = {
  initializeBot: initializeBot,
  updateNodeStatus: updateNodeStatus,
  updateNodeStatusSuccess: updateNodeStatusSuccess,
  updateNodeStatusFailed: updateNodeStatusFailed
};
