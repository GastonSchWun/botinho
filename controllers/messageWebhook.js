const processMessage = require('../helpers/processMessage');

module.exports = (req, res) => {
  console.log("messageWebhook:: ");
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {

      if (entry.messaging && entry.messaging.length) {
        let webhook_event =  entry.messaging[0];
        let senderId = webhook_event.sender.id;

        if (webhook_event.message) {
          processMessage(senderId, webhook_event.message);
        } else if (webhook_event.postback){
          console.log("postback",webhook_event.postback)
        }
      } else {
        console.log("no messaging", entry)
      }
    });
    res.status(200).end();
  }
};