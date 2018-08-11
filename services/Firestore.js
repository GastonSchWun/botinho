const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'botinho-b8465',
  keyFilename: './services/botinho-b986029f518e.json',
});
firestore.settings({timestampsInSnapshots: true});

const COLLECTIONS = {
  USERS: 'users',
  CONTENT: 'content'
}

async function _setDocument (collection, doc, data) {
  let docRef = firestore.collection(collection).doc(doc);
  
  let setDoc = await docRef.set(data, {merge: true}).then((ref) => {
    return { 'success': true, ref };
  }).catch((error) => {
    console.log("Error createUser", error);
    return { 'success': false, error };
  });

  return setDoc
}

async function _getDocument (collection, doc) {
  let docRef = firestore.collection(collection).doc(doc);
  let documentSnapshot = await docRef.get()
  return documentSnapshot.exists ? documentSnapshot.data() : null
}

async function setUser (userId, data) {
  let userDoc = await _getDocument(COLLECTIONS.USERS, userId);
  let newDate = new Date().getTime();
  data.updated = newDate;

  if (!userDoc) {
    data.created = newDate;
  }

  return await _setDocument(COLLECTIONS.USERS, userId, data);
}

async function getUser (userId) {
  let userDoc = await _getDocument(COLLECTIONS.USERS, userId);
  return { user: userDoc };
}

async function getLogos () {
  let logosDoc = await _getDocument(COLLECTIONS.CONTENT, 'logos');
  return { logos: logosDoc }
}

async function getUserAndLogos (userId) {
  let userDoc = await _getDocument(COLLECTIONS.USERS, userId);
  let logosDoc = await _getDocument(COLLECTIONS.CONTENT, 'logos');
  return { user: userDoc, logos: logosDoc }
}

module.exports.getUser = getUser
module.exports.setUser = setUser
module.exports.getLogos = getLogos
module.exports.getUserAndLogos = getUserAndLogos
