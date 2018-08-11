const request = require('request');

const FB_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

module.exports = (senderId, typing) => {
  if (!senderId || !typing) {
    return null;
  }

  const sender_action = typing ? 'typing_on' : 'typing_off';

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: senderId },
      sender_action,
    },
  });
  return false;
};
