const { registerCommand } = require("../core/commandHandler");

registerCommand("say", {
  description: "Send a message in public chat",
  usage: "!say <message>",
  admin: true,
  execute(bot, sender, args, respond) {
    const text = args.join(" ");
    if (!text) {
      respond("Usage: !say <message>");
      return;
    }
    bot.chat(text);
  },
});
