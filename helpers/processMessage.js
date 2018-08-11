const sendMessage = require('./sendMessage');
const { getUser, setUser, getUserAndLogos } = require('../services/Firestore');

/* ApiAi === Dialogflow */
/*const API_AI_TOKEN = '9d3388ad7f10465e95c1c8010517a270';
const apiAiClient = require('apiai')(API_AI_TOKEN);*/

async function delay (senderId, ms) {
  await timeout(ms)
  let response = {
    "text": "chau amigo"
  }
  sendMessage(senderId, response);
}

const timeout = (ms) => {
  new Promise(res => setTimeout(res, ms))
};

const getLogo = (logoId, logos) => {
  return logoId ? logos[logoId] : logos[Math.floor(Math.random()*logos.length)]
};

const getUnseenLogos = (allLogos, seenLogos) => {

};

const sendDefault = (senderId) => {
  let response = { "text": "hola amigo" }
  sendMessage(senderId, response);
};

const sendQuest = async (senderId) => {
  let { user, logos } = await getUserAndLogos(senderId)
  let logo = getLogo(null, logos)
  /*let quests = {}

  if (user && user.quests) {

  }*/

  setUser(senderId, {}).then((res) => {
    console.log(res)
    let response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Este es el logo de " + logo.name +"?",
            "subtitle": "Elegí tu respuesta.",
            "image_url": logo.img,
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
    sendMessage(senderId, response)
  });
}

module.exports = (senderId, message) => {
  if (message) {
    /*console.log("processMessage:: senderId", senderId)
    console.log("processMessage:: message", message)
    if (message.nlp && message.nlp.entities) {
      console.log("processMessage:: entities", message.nlp.entities)
    }*/
    switch (message.text) {
      case "hit me":
        sendQuest(senderId)
        break;
      default:
        sendDefault(senderId)
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