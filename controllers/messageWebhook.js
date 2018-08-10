const processMessage = require('../helpers/processMessage');

module.exports = (req, res) => {
  console.log("messageWebhook:: "/*, req, res*/)
  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      if (entry.messaging) {
        entry.messaging.forEach(event => {
          if (event.message && event.message.text) {
            processMessage(event);
          }
        });
      } else {
        console.log("no messaging", entry)
      }
    });
    res.status(200).end();
  }
};