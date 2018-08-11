/* eslint no-param-reassign: ["error", { "props": false }] */
const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'botinho-b8465',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
firestore.settings({ timestampsInSnapshots: true });

const COLLECTIONS = {
  USERS: 'users',
  CONTENT: 'content',
};

// Firebase Functions
async function setDocument(collection, doc, data) {
  const docRef = firestore.collection(collection).doc(doc);

  const setDoc = await docRef.set(data, { merge: true })
    .then(ref => ({ success: true, ref }))
    .catch((error) => {
      console.log('Error createUser', error);
      return { success: false, error };
    });

  return setDoc;
}

async function getDocument(collection, doc) {
  const docRef = firestore.collection(collection).doc(doc);
  const documentSnapshot = await docRef.get();
  return documentSnapshot.exists ? documentSnapshot.data() : null;
}

// Exported
async function setUser(userId, data) {
  const userDoc = await getDocument(COLLECTIONS.USERS, userId);
  const newDate = new Date().getTime();
  data.updated = newDate;

  if (!userDoc) {
    data.created = newDate;
  }

  return setDocument(COLLECTIONS.USERS, userId, data);
}

async function getUser(userId) {
  const userDoc = await getDocument(COLLECTIONS.USERS, userId);
  return { user: userDoc };
}

async function getLogos() {
  const logosDoc = await getDocument(COLLECTIONS.CONTENT, 'logos');
  return { logos: logosDoc };
}

async function getUserAndLogos(userId) {
  const userDoc = await getDocument(COLLECTIONS.USERS, userId);
  const logosDoc = await getDocument(COLLECTIONS.CONTENT, 'logos');
  return { user: userDoc, logos: logosDoc };
}

module.exports.setUser = setUser;
module.exports.getUser = getUser;
module.exports.getLogos = getLogos;
module.exports.getUserAndLogos = getUserAndLogos;
