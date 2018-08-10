const request = require('request');

const FACEBOOK_ACCESS_TOKEN = 'EAAGy9WdDbsoBAGoIID579tlGdwpBe9CqmBO6vefSZB3um9lZAyiBEhgACZCRjrA4MyaD9K4wVAb7juzRZAOUW8lLiDUcfDkQ7Nyj0bq7iylbRd5oabtQjQ7PmQtcFFobS2DZC5U0PVofXlAbiBaCApO0ytrqXzfeFQ9k1VRvZBPAZDZD';

module.exports = (senderId, message) => {
  if (!senderId || !message) {
    return null
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: senderId },
      message: message,
    }
  });
}