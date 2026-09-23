const crypto = require('crypto');

const generateInviteToken = () => crypto.randomBytes(32).toString('hex');

module.exports = generateInviteToken;
