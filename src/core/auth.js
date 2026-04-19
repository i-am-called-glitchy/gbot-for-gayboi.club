const { ADMIN_USERS } = require("../config");

/**
 * Check whether a player is an admin.
 * @param {string} username
 * @returns {boolean}
 */
function isAdmin(username) {
  return ADMIN_USERS.includes(username);
}

module.exports = { isAdmin };
