// --- Load all command modules ---
// Just require each file; they self-register via registerCommand().
require("./modules/say");
require("./modules/follow");
require("./modules/coinflip");
require("./modules/killme");
require("./modules/tpa");
require("./modules/discord");

// --- Boot the bot ---
const { createBot } = require("./core/bot");
const bot = createBot();
