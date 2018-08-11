const sendMessage = require('./sendMessage');
const { getUser, setUser, getUserAndLogos } = require('../services/Firestore');

/* ApiAi === Dialogflow */
/*const API_AI_TOKEN = '9d3388ad7f10465e95c1c8010517a270';
const apiAiClient = require('apiai')(API_AI_TOKEN);*/

let senderId2 = null;

async function delay (senderId, ms) {
  await timeout(ms)
  let response = {
    "text": "chau amigo"
  };
  sendMessage(senderId, response);
}

const timeout = (ms) => {
  new Promise(res => setTimeout(res, ms))
};

const checkUngessedLogos = (logos, user) => {
  let logosArray = [];
  for (let logo in logos) {
    if (logos.hasOwnProperty(logo)) {
      if (!user || !user.quests || !user.quests.hasOwnProperty(logo) || !user.quests[logo]) {
        logosArray.push(logo)
      }
    }
  }

  return logosArray
};

const sendDefault = (senderId) => {
  /*idealmente seria un boton*/
  let response = { "text": "hola amigo! Cuando estes listo para adivinar mandame un mensaje diciendo: \"dame logo\"" }
  sendMessage(senderId, response);
};

const sendQuest = async (senderId) => {
  let { user, logos } = await getUserAndLogos(senderId);
  let unguessedLogos = checkUngessedLogos(logos, user);

  if (unguessedLogos.length) {
    let randomLogo = unguessedLogos[Math.floor(Math.random()*unguessedLogos.length)]
    let userQuest = { quests:{}}
    userQuests[randomLogo] = true

    setUser(senderId, userQuest).then((res) => {
      console.log('senderId2', senderId2)
      let response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Este es el logo de " + logos[randomLogo].name +"?",
              "subtitle": "Elegí tu respuesta.",
              "image_url": logos[randomLogo].img,
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
    
  } else {
    let response = { "text": "ya adivinaste todos, sos un crack!" }
    sendMessage(senderId, response);
  }

}

module.exports = (senderId, message) => {
  senderId2 = senderId
  if (message) {
    /*console.log("processMessage:: senderId", senderId)
    console.log("processMessage:: message", message)
    if (message.nlp && message.nlp.entities) {
      console.log("processMessage:: entities", message.nlp.entities)
    }*/
    switch (message.text) {
      case "dame logo":
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