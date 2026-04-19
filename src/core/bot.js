const mineflayer = require("mineflayer");
const {
  pathfinder,
  Movements,
} = require("mineflayer-pathfinder");
const config = require("../config");
const commandHandler = require("./commandHandler");

/**
 * Create the bot, load plugins, wire up lifecycle events.
 * @returns {import("mineflayer").Bot}
 */
function createBot() {
  const bot = mineflayer.createBot({
    host: config.HOST,
    port: config.PORT,
    username: config.USERNAME,
  });

  bot.loadPlugin(pathfinder);

  bot.once("spawn", () => {
    const movements = new Movements(bot);
    movements.allowFreeMotion = false;
    bot.pathfinder.setMovements(movements);
    console.log(`[bot] Spawned as ${bot.username}`);
  });

  // Attach command listener
  commandHandler.attach(bot);

  // Lifecycle logging
  bot.on("error", (err) => console.error(`[error] ${err.message}`));
  bot.on("kicked", (reason) => console.warn(`[kicked] ${reason}`));
  bot.on("end", () => console.log("[bot] Disconnected"));

  return bot;
}

module.exports = { createBot };
