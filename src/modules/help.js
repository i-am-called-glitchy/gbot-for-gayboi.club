const { registerCommand, getCommands } = require("../core/commandHandler");
const { isAdmin } = require("../core/auth");
const { PREFIX } = require("../config");

registerCommand("help", {
  description: "List available commands",
  usage: "!help [command]",
  execute(bot, sender, args, respond) {
    const commands = getCommands();
    const adminUser = isAdmin(sender);

    // !help <command> — show details for one command
    if (args[0]) {
      const name = args[0].toLowerCase().replace(/^!/, "");
      const entry = commands.get(name);
      if (!entry) {
        respond(`Unknown command: ${PREFIX}${name}`);
        return;
      }
      if (entry.admin && !adminUser) {
        respond("That command is admin-only.");
        return;
      }
      respond(`${PREFIX}${name} — ${entry.description}`);
      respond(`Usage: ${entry.usage}`);
      return;
    }

    // !help — list all visible commands
    const visible = [];
    for (const [name, entry] of commands) {
      if (entry.admin && !adminUser) continue;
      visible.push(`${PREFIX}${name}`);
    }

    respond(`Commands: ${visible.join(", ")}`);
    respond(`Tip: ${PREFIX}help <command> for details`);
  },
});
