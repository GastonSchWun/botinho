const { sendMessage, sendTyping } = require('./sendMessage');
const { setUser, getUserAndLogos } = require('../services/Firestore');

const { hasOwnProperty } = Object.prototype;
let USER_ID = null;

const getUngessedLogos = (logos, user) => {
  const logosArray = [];

  Object.keys(logos).forEach((logo) => {
    if (hasOwnProperty.call(logos, logo)) {
      if (!user || !user.quests || !hasOwnProperty.call(user.quests, logo) || !user.quests[logo]) {
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
    text: 'Listo maifrend!\nMensajeame "dame logo" cuando quieras perder ;)',
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
                // payload: `${randomLogo}::yes`,
                payload: {
                  logo: randomLogo,
                  success: true,
                },
              },
              {
                type: 'postback',
                title: 'No!',
                // payload: `${randomLogo}::no`,
                payload: {
                  logo: randomLogo,
                  success: false,
                },
              },
            ],
          }],
        },
      },
    };
    sendMessage(USER_ID, response);
  } else {
    response = {
      text: 'Ya adivinaste todos, sos un crack! 8)\nSi queres volvera empezar, mensajeame "reset".',
    };
    sendMessage(USER_ID, response);
  }
};

module.exports = (senderId, message) => {
  USER_ID = senderId;

  if (message) {
    /* console.log('processMessage:: senderId', senderId)
    console.log('processMessage:: message', message) */
    if (message.nlp && message.nlp.entities) {
      console.log('processMessage:: entities', message.nlp.entities);
    }
    switch (message.text) {
      case 'dame logo':
        sendTyping(USER_ID, true);
        sendQuest();
        break;
      case 'reset':
        resetQuest();
        break;
      default:
        sendDefault();
    }
  }
};
