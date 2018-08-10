const request = require('request');

const FACEBOOK_ACCESS_TOKEN = 'EAAGy9WdDbsoBAGoIID579tlGdwpBe9CqmBO6vefSZB3um9lZAyiBEhgACZCRjrA4MyaD9K4wVAb7juzRZAOUW8lLiDUcfDkQ7Nyj0bq7iylbRd5oabtQjQ7PmQtcFFobS2DZC5U0PVofXlAbiBaCApO0ytrqXzfeFQ9k1VRvZBPAZDZD';

/* ApiAi === Dialogflow */
const API_AI_TOKEN = '9d3388ad7f10465e95c1c8010517a270';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const timeout = ms => new Promise(res => setTimeout(res, ms))

const sendMessage = (senderId, response) => {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: senderId },
      message: response,
    }
  });
};

async function delay (senderId, ms) {
  await timeout(ms)
  let response = {
    "text": "chau amigo"
  }
  sendMessage(senderId, response);
}

module.exports = (senderId, message) => {
  if (message) {
    console.log("processMessage:: senderId", senderId)
    console.log("processMessage:: message", message)

    if (message.nlp && message.nlp.entities) {
      console.log("processMessage:: entities", message.nlp.entities)
    }

    if (message.text === "opciones") {
      let response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Este es el logo de Wunderman?",
              "subtitle": "Elegí tu respuesta.",
              "image_url": "http://www.wunderman.com.ar/sites/all/themes/wunderman/logo.png",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Si!",
                  "payload": "yes",
                },
                {
                  "type": "postback",
                  "title": "No!",
                  "payload": "no",
                }
              ],
            }]
          }
        }
      }
      sendMessage(senderId, response);
    } else {
      let response = {
        "text": "hola amigo"
      }
      sendMessage(senderId, response);
    }
  }
  
  //Async message
  //delay(senderId, 5000)
  

  //DIALOGFLOW
  /*const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'crowdbotics_bot'});
  //console.log("processMessage:: apiaiSession",apiaiSession)

  apiaiSession.on('response', (response) => {
    const result = response.result.fulfillment.speech;
    console.log("processMessage::onResponse", senderId, result)
    sendMessage(senderId, result);
  });

  apiaiSession.on('error', error => console.log(error));
  apiaiSession.end();*/
};