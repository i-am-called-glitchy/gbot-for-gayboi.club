const { registerCommand } = require("../core/commandHandler");
const { goals: { GoalNear } } = require("mineflayer-pathfinder");

// Shared follow state
const followState = { target: null };

function stopFollowing(bot) {
  followState.target = null;
  bot.pathfinder?.setGoal(null);
}

registerCommand("follow", {
  description: "Follow a player (defaults to you)",
  usage: "!follow [player]",
  admin: true,
  execute(bot, sender, args, respond) {
    const target = args[0] || sender;

    stopFollowing(bot);

    const player = bot.players[target];
    if (!player || !player.entity) {
      respond(`Can't see player: ${target}`);
      return;
    }

    followState.target = target;
    const { x, y, z } = player.entity.position;
    bot.pathfinder.setGoal(new GoalNear(x, y, z, 2));
    respond(`Following ${target}`);
  },
});

registerCommand("stop", {
  description: "Stop following / cancel current action",
  usage: "!stop",
  admin: true,
  execute(bot, sender, args, respond) {
    stopFollowing(bot);
    respond("Stopped.");
  },
});

module.exports = { followState, stopFollowing };
