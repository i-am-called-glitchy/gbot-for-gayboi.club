const { PREFIX } = require("../config");
const { isAdmin } = require("./auth");

/** @type {Map<string, { description: string, usage: string, admin: boolean, execute: function }>} */
const commands = new Map();

/**
 * Register a command.
 * @param {string} name        — command name (lowercase, no prefix)
 * @param {object} definition
 * @param {string} definition.description — short help text
 * @param {string} definition.usage       — usage string shown in help
 * @param {boolean} [definition.admin=false] — whether the command requires admin
 * @param {function(bot, sender, args): void} definition.execute
 */
function registerCommand(name, definition) {
  commands.set(name.toLowerCase(), { admin: false, ...definition });
}

/**
 * Return all registered commands (for the help module, etc.).
 * @returns {Map}
 */
function getCommands() {
  return commands;
}

// Event listeners are bound below

/**
 * Attach the chat listener to `bot`.
 * Call this once after the bot is created.
 */
function attach(bot) {
  // Log all raw messages for debugging/history
  bot.on("message", (jsonMsg) => {
    console.log(`[log] ${jsonMsg.toString()}`);
  });

  const rateLimits = new Map();

  const dispatch = (sender, message, isWhisper) => {
    if (sender === bot.username) return;
    if (!message.startsWith(PREFIX)) return;

    const now = Date.now();
    let limit = rateLimits.get(sender);
    if (!limit) {
      limit = { count: 0, lastReset: now, timedOutUntil: 0 };
      rateLimits.set(sender, limit);
    }

    if (now < limit.timedOutUntil) {
      return; // Silently fail while timed out
    }

    if (now - limit.lastReset > 1000) {
      limit.count = 0;
      limit.lastReset = now;
    }

    limit.count++;

    if (limit.count > 3) {
      limit.timedOutUntil = now + 3000;
      console.log(`[ratelimit] ${sender} timed out for 3s (spam)`);
      return; // Silently fail
    }

    const [cmd, ...args] = message.slice(PREFIX.length).split(" ");
    const entry = commands.get(cmd.toLowerCase());

    const respond = (text) => {
      if (isWhisper) {
        bot.whisper(sender, text);
      } else {
        bot.chat(text);
      }
    };

    if (!entry) {
      return;
    }


    if (entry.admin && !isAdmin(sender)) {
      console.log(`[auth] Rejected admin command !${cmd} from ${sender}`);
      respond("You don't have permission to use that command.");
      return;
    }

    try {
      entry.execute(bot, sender, args, respond, isWhisper);
    } catch (err) {
      console.error(`[cmd] Error running !${cmd}:`, err);
      respond(`Error: ${err.message}`);
    }
  };

  bot.on("chat", (username, message) => dispatch(username, message, false));
  bot.on("whisper", (username, message) => dispatch(username, message, true));
}

module.exports = { registerCommand, getCommands, attach };
