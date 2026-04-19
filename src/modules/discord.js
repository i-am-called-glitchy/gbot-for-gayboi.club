const { registerCommand } = require("../core/commandHandler");

const discordCommand = {
  description: "Get the Discord server link",
  usage: "!discord (or !dc)",
  execute(bot, sender, args, respond, isWhisper) {
    const jsonMsg = {
      text: "Join the Discord! [Click Here]",
      color: "blue",
      bold: true,
      clickEvent: {
        action: "open_url",
        value: "https://discord.gg/exte2sYr63",
      },
      hoverEvent: {
        action: "show_text",
        value: "Opens https://discord.gg/exte2sYr63",
      },
    };

    const msgStr = JSON.stringify(jsonMsg);

    if (isWhisper) {
      bot.chat(`/tellraw ${sender} ${msgStr}`);
    } else {
      // Server blocks @a, so we iterate and tellraw each player specifically
      for (const playername of Object.keys(bot.players)) {
        bot.chat(`/tellraw ${playername} ${msgStr}`);
      }
    }
  },
};

registerCommand("discord", discordCommand);
registerCommand("dc", discordCommand);
