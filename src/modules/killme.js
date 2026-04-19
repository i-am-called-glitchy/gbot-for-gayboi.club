const { registerCommand } = require("../core/commandHandler");

// Store players that have pending /kill requests
const pendingConfirms = new Set();

registerCommand("killme", {
  description: "Lets the bot kill you (requires confirm)",
  usage: "!killme [confirm]",
  admin: false,
  execute(bot, sender, args, respond) {
    if (args[0] === "confirm") {
      if (pendingConfirms.has(sender)) {
        pendingConfirms.delete(sender);
        bot.chat(`/kill ${sender}`);
        respond(`Killed ${sender} hf`);
      } else {
        respond("You have no pending !killme request.");
      }
    } else {
      pendingConfirms.add(sender);
      respond("WARNING: This will kill your character! Type '!killme confirm' within 30 seconds to proceed.");
      
      // Auto-expire the confirmation
      setTimeout(() => {
        pendingConfirms.delete(sender);
      }, 30000);
    }
  },
});
