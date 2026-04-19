const { registerCommand } = require("../core/commandHandler");

// Tracks outgoing TPA requests. Map key is the requester's username.
// value format: { target: string, timer: NodeJS.Timeout }
const outgoingRequests = new Map();

registerCommand("tpa", {
  description: "Request to teleport to a player",
  usage: "!tpa <player>",
  admin: false,
  execute(bot, sender, args, respond) {
    const target = args[0];
    if (!target) {
      respond("Usage: !tpa <player>");
      return;
    }
    
    if (target.toLowerCase() === sender.toLowerCase()) {
      respond("You can't teleport to yourself.");
      return;
    }

    if (outgoingRequests.has(sender)) {
      respond("You already have a pending teleport request. Please wait for it to be accepted or expire.");
      return;
    }

    // Set 60-second expiration for the request
    const timer = setTimeout(() => {
      outgoingRequests.delete(sender);
    }, 60000);

    outgoingRequests.set(sender, { target, timer });

    // Whisper the target directly with the accept notification
    bot.whisper(target, `${sender} has requested to teleport to you, type or whisper !tpaccept ${sender} to accept`);
    respond(`Sent a teleport request to ${target}.`);
  },
});

registerCommand("tpaccept", {
  description: "Accept a player's teleport request",
  usage: "!tpaccept <player>",
  admin: false,
  execute(bot, sender, args, respond) {
    const requester = args[0];
    if (!requester) {
      respond("Usage: !tpaccept <player>");
      return;
    }

    // The user running !tpaccept must be the target of the outgoing request
    const reqData = outgoingRequests.get(requester);
    if (!reqData || reqData.target.toLowerCase() !== sender.toLowerCase()) {
      respond(`You have no pending teleport request from ${requester}.`);
      return;
    }

    // Clear request
    clearTimeout(reqData.timer);
    outgoingRequests.delete(requester);

    // Using OP privileges to teleport the requester to the sender
    bot.chat(`/tp ${requester} ${sender}`);
    
    bot.whisper(requester, `Your teleport request was accepted by ${sender}!`);
  },
});
