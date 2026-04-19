const { registerCommand } = require("../core/commandHandler");
const { PREFIX, DISCORD_INVITE } = require("../config");

registerCommand("about", {
  description: "Info about this bot",
  usage: "!about",
  execute(bot, sender, args, respond) {
    respond(`g_bot — a Mineflayer utility bot for mc.gayboi.club`);
    respond(`Use ${PREFIX}help to see available commands.`);
    respond(`Discord: ${DISCORD_INVITE}`);
  },
});
