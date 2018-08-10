const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'botinho-b8465',
  keyFilename: '../botinho-b986029f518e.json',
});

async function _setDocument (document, data) {
  let docRef = firestore.doc(document);
  
  let setDoc = await docRef.set(data, {merge: true}).then((ref) => {
    return { 'success': true, ref };
  }).catch((error){
    console.log("Error createUser", error);
    return { 'success': false, error };
  });

  return setDoc
}

async function _getDocument (document) {
  let docRef = firestore.doc(document);
  let documentSnapshot = await documentRef.get()

  return documentSnapshot.exists ? documentSnapshot.data() : null
}

export async function getUser (userId, data) {
  let userDoc = await _getDocument(`users/${userId}`);

  return userDoc;
}

export async function setUser (userId, data) {
  let userExists = await _getDocument(`users/${userId}`);
  let newDate = new Date().getTime();
  data.updated = newDate;

  if (!userExists) {
    data.created = newDate;
  }
  
  let updateDoc = await _setDocument(userId, data);

  return updateDoc;
}