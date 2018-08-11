const request = require('request');

const FB_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

module.exports = function sendTextMessage(senderId, message) {
  if (!senderId || !message) {
    return null;
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: senderId },
      // sender_action: 'typing_off',
      message,
    },
  });
  return false;
};

module.exports = function sendTypingOn(senderId) {
  if (!senderId) {
    return null;
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: senderId },
      sender_action: 'typing_on',
    },
  });
  return false;
};

module.exports = function sendTypingOff(senderId) {
  if (!senderId) {
    return null;
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FB_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: senderId },
      sender_action: 'typing_off',
    },
  });
  return false;
};
