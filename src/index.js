// --- Load all command modules ---
// Just require each file; they self-register via registerCommand().
require("./modules/say");
require("./modules/follow");
require("./modules/coinflip");
require("./modules/killme");
require("./modules/tpa");
require("./modules/discord");
require("./modules/help");
require("./modules/about");

// --- Boot the bot ---
const { createBot } = require("./core/bot");
const bot = createBot();
