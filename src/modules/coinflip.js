const { registerCommand } = require("../core/commandHandler");

registerCommand("coinflip", {
  description: "Flip a coin",
  usage: "!coinflip",
  execute(bot, sender, args, respond) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    respond(`${sender} ${result}!`);
  },
});
