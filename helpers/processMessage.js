const { sendMessage, sendTypingOn } = require('./sendMessage');
const { setUser, getUserAndLogos } = require('../services/Firestore');

/* ApiAi === Dialogflow */
/* const API_AI_TOKEN = '9d3388ad7f10465e95c1c8010517a270';
const apiAiClient = require('apiai')(API_AI_TOKEN); */

const { hasOwnProperty } = Object.prototype;
let USER_ID = null;

const getUngessedLogos = (logos, user) => {
  const logosArray = [];

  Object.keys(logos).foreEach((logo) => {
    if (hasOwnProperty.call(logos, logo)) {
      if (!user || !user.quests || !hasOwnProperty(user.quests, logo) || !user.quests[logo]) {
        logosArray.push(logo);
      }
    }
  });

  return logosArray;
};

const sendDefault = () => {
  /* idealmente seria un boton */
  const response = {
    text: 'Hola amigo!\nCuando estes listo para adivinar mandame un mensaje diciendo: "dame logo"',
  };
  sendMessage(USER_ID, response);
};

const resetQuest = async () => {
  const data = { quests: {} };
  const response = {
    text: 'Listo maifrend!\nMensajeame "dame logo" cuando quieras un perder :)',
  };

  setUser(USER_ID, data).then(() => {
    sendMessage(USER_ID, response);
  });
};

const sendQuest = async () => {
  const { user, logos } = await getUserAndLogos(USER_ID);
  const unguessedLogos = getUngessedLogos(logos, user);
  let response = {};

  if (unguessedLogos.length) {
    const randomLogo = unguessedLogos[Math.floor(Math.random() * unguessedLogos.length)];
    const data = { quests: {} };
    data.quests[randomLogo] = true;

    setUser(USER_ID, data).then(() => {
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
      sendMessage(USER_ID, response);
    });
  } else {
    response = {
      text: 'Ya adivinaste todos, sos un crack!\nSi queres volvera empezar, mensajeame "reset".',
    };
    sendMessage(USER_ID, response);
  }
};

module.exports = (senderId, message) => {
  USER_ID = senderId;
  sendTypingOn(USER_ID);

  if (message) {
    /* console.log('processMessage:: senderId', senderId)
    console.log('processMessage:: message', message)
    if (message.nlp && message.nlp.entities) {
      console.log('processMessage:: entities', message.nlp.entities)
    } */
    switch (message.text) {
      case 'dame logo':
        sendQuest();
        break;
      case 'reset':
        resetQuest();
        break;
      default:
        sendDefault();
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
