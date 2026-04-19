const { registerCommand } = require("../core/commandHandler");

registerCommand("killme", {
  description: "Lets the bot kill you",
  usage: "!killme",
  admin: false,
  execute(bot, sender, args, respond) {
    bot.chat(`/kill ${sender}`);
    respond(`Killed ${sender} hf`);
  },
});
