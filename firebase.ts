import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBypsck62lwKGfmSVbb6A6HvCNLGCPD3mI",
  authDomain: "whastapp2-5489d.firebaseapp.com",
  projectId: "whastapp2-5489d",
  storageBucket: "whastapp2-5489d.appspot.com",
  messagingSenderId: "884980456906",
  appId: "1:884980456906:web:57c0d857a77aefacb34333"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };