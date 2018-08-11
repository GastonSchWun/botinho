const { sendMessage, sendTyping } = require('./sendMessage');
const { setUser, getUser } = require('../services/Firestore');

let USER_ID = null;

const sendCorrect = () => {
  /* idealmente seria un boton */
  const response = {
    text: 'Acertaste genio (y)',
  };
  sendMessage(USER_ID, response);
};

const sendIncorrect = () => {
  /* idealmente seria un boton */
  const response = {
    text: 'Uf, le pifiaste :(',
  };
  sendMessage(USER_ID, response);
};

const sendRepeated = () => {
  /* idealmente seria un boton */
  const response = {
    text: 'No podes cambiar la respuesta >:(',
  };
  sendMessage(USER_ID, response);
};

const saveAnswer = async (logo) => {
  const data = { quests: {} };
  data.quests[logo] = true;

  setUser(USER_ID, data).then(() => {
    sendCorrect();
  });
};

const checkRepeated = async (postback) => {
  const user = await getUser(USER_ID);
  const { logo, success } = postback;
  let repeated = false;

  if (user && user.quests && user.quests[logo]) {
    repeated = true;
  }

  if (repeated) {
    sendRepeated();
  } else if (success) {
    saveAnswer(logo);
  } else {
    sendIncorrect();
  }
  return false;
};

module.exports = (senderId, postback) => {
  USER_ID = senderId;

  if (postback && postback.logo) {
    sendTyping(USER_ID, true);
    checkRepeated(postback);
  }
};
