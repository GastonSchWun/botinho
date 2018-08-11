const processMessage = require('../helpers/processMessage');
const processPostback = require('../helpers/processPostback');

module.exports = (req, res) => {
  console.log('messageWebhook:: new');
  const { body } = req;

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      if (entry.messaging && entry.messaging.length) {
        const WEBHOOK_EVENT = entry.messaging[0];
        const senderId = WEBHOOK_EVENT.sender.id;

        if (WEBHOOK_EVENT.message) {
          processMessage(senderId, WEBHOOK_EVENT.message);
        } else if (WEBHOOK_EVENT.postback) {
          console.log('postback', WEBHOOK_EVENT.postback);
          processPostback(senderId, WEBHOOK_EVENT.postback);
        }
      } else {
        console.log('no messaging', entry);
      }
    });
    res.status(200).end();
  }
};
