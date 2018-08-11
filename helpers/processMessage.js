const sendMessage = require('./sendMessage');
const { setUser, getUserAndLogos } = require('../services/Firestore');

/* ApiAi === Dialogflow */
/* const API_AI_TOKEN = '9d3388ad7f10465e95c1c8010517a270';
const apiAiClient = require('apiai')(API_AI_TOKEN); */

let senderId2 = null;

const checkUngessedLogos = (logos, user) => {
  const logosArray = [];
  for (const logo in logos) {
    if (logos.hasOwnProperty(logo)) {
      if (!user || !user.quests || !user.quests.hasOwnProperty(logo) || !user.quests[logo]) {
        logosArray.push(logo);
      }
    }
  }

  return logosArray;
};

const sendDefault = (senderId) => {
  /* idealmente seria un boton */
  const response = {
    text: 'hola amigo! Cuando estes listo para adivinar mandame un mensaje diciendo: "dame logo"',
  };
  sendMessage(senderId, response);
};

const resetQuest = async () => {
  const data = { quests: {} };
  const response = {
    text: 'listo maifrend! mensajeame "dame logo" cuando quieras',
  };

  setUser(senderId, data).then(() => {
    sendMessage(senderId2, response);
  });
};

const sendQuest = async (senderId) => {
  const { user, logos } = await getUserAndLogos(senderId);
  const unguessedLogos = checkUngessedLogos(logos, user);
  let response = {};

  if (unguessedLogos.length) {
    const randomLogo = unguessedLogos[Math.floor(Math.random() * unguessedLogos.length)];
    const data = { quests: {} };
    data.quests[randomLogo] = true;

    setUser(senderId, data).then(() => {
      console.log('senderId2', senderId2);
      response = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: `Este es el logo de ${logos[randomLogo].name}?`,
              subtitle: 'Elegí tu respuesta.',
              image_url: logos[randomLogo].img,
              buttons: [
                {
                  type: 'postback',
                  title: 'Si!',
                  payload: 'yes',
                },
                {
                  type: 'postback',
                  title: 'No!',
                  payload: 'no',
                },
              ],
            }],
          },
        },
      };
      sendMessage(senderId, response);
    });
  } else {
    response = {
      text: 'ya adivinaste todos, sos un crack!',
    };
    sendMessage(senderId, response);
  }
};

module.exports = (senderId, message) => {
  senderId2 = senderId;
  if (message) {
    /* console.log('processMessage:: senderId', senderId)
    console.log('processMessage:: message', message)
    if (message.nlp && message.nlp.entities) {
      console.log('processMessage:: entities', message.nlp.entities)
    } */
    switch (message.text) {
      case 'dame logo':
        sendQuest(senderId);
        break;
      case 'reset':
        resetQuest(senderId);
        break;
      default:
        sendDefault(senderId);
    }
  }

  // DIALOGFLOW
  /* const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'crowdbotics_bot'});
  // console.log('processMessage:: apiaiSession',apiaiSession)

  apiaiSession.on('response', (response) => {
    const result = response.result.fulfillment.speech;
    console.log('processMessage::onResponse', senderId, result)
    sendMessage(senderId, result);
  });

  apiaiSession.on('error', error => console.log(error));
  apiaiSession.end(); */
};
