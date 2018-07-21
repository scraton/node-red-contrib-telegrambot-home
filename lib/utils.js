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

function validateChatId(node, msg) {
  return (node.chatId || (msg.telegram && msg.telegram.chat && msg.telegram.chat.id));
}

function updateNodeStatus(node, fill, shape, msg) {
  node.status({ fill: fill, shape: shape, text: msg });
}

function updateNodeStatusSuccess(node, msg="connected") {
  updateNodeStatus(node, "green", "dot", msg);
}

function updateNodeStatusPending(node, msg) {
  updateNodeStatus(node, "yellow", "ring", msg);
}

function updateNodeStatusFailed(node, msg) {
  node.warn(msg);
  updateNodeStatus(node, "red", "ring", msg);
}

function timeUnits(time, units) {
  switch (units) {
    case "ms":  return time;
    case "s":   return time * 1000;
    case "min": return timeUnits(time * 60, "s");
    case "hr":  return timeUnits(time * 60, "min");
    default:    throw new Error("Invalid units");
  }
}

module.exports = {
  initializeBot: initializeBot,
  validateChatId: validateChatId,
  updateNodeStatus: updateNodeStatus,
  updateNodeStatusSuccess: updateNodeStatusSuccess,
  updateNodeStatusFailed: updateNodeStatusFailed,
  updateNodeStatusPending: updateNodeStatusPending,
  timeUnits: timeUnits
};
