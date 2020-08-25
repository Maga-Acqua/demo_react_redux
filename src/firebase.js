import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// Your web app's Firebase configuration
let firebaseConfig = {
	apiKey: "AIzaSyBvXHyTmprR5zQ3_26AwL1DXsnbM9OrTgU",
	authDomain: "curso-react-22474.firebaseapp.com",
	databaseURL: "https://curso-react-22474.firebaseio.com",
	projectId: "curso-react-22474",
	storageBucket: "curso-react-22474.appspot.com",
	messagingSenderId: "269321497075",
	appId: "1:269321497075:web:5aff52c84f0add08028a86",
	measurementId: "G-3E8VSCXFJE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

let db = firebase.firestore().collection('favs')

//servicio para traer los favoritos correspondientes a cada user desde Firebase
export function getFavs(uid){
	return db.doc(uid).get()
		.then(snap=>{
			return snap.data().favorites
		})
}
//servicio para que guarde en db firebase los favs
export function updateDB(array, uid){
	//para que guarde los favs correspondientes a cada user
	return db.doc(uid).set({favorites:[...array]}) //set() espera un objeto

}

//servicio para logput
export function signOutGoogle(){
	firebase.auth().signOut()
}

//servicio para login
export function loginWithGoogle(){
	let provider = new firebase.auth.GoogleAuthProvider
	return firebase.auth().signInWithPopup(provider)
		.then(snap => snap.user)
}