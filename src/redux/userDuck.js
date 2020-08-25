import { loginWithGoogle, signOutGoogle } from '../firebase'
import { retreiveFavs } from './moviesDuck'

//constants
let initialData = {
	loggedIn: false,
	fetching: false
}

let LOGIN = "LOGIN"
let LOGIN_SUCCESS = "LOGIN_SUCCESS"
let LOGIN_ERROR = "LOGIN_ERROR"

let LOGOUT = "LOGOUT"

//reducer
export default function reducer(state = initialData, action){
	switch(action.type){
		case LOGOUT:
			return {...initialData } //setea fetching:false loggedIn:false

		case LOGIN:
			return {...state, fetching:true}

		case LOGIN_SUCCESS:
			return {...state, fetching:false, ...action.payload, loggedIn:true} //action.payload representa al user
		
		case LOGIN_ERROR:
			return {...state, fetching:false, error: action.payload}
		
		default:
		return state
	}
}


//function aux
function saveStorage(storage){
	localStorage.storage = JSON.stringify(storage);
}

//action (action creator)
export function logOutAction(){
	return (dispatch, getState)=>{
		signOutGoogle()
		dispatch({
			type:LOGOUT,

		})
		localStorage.removeItem('storage')
	}
}

export function restoreSessionAction () {
	return (dispatch) => {
		let storage = localStorage.getItem('storage');
		storage = JSON.parse(storage);
		if(storage && storage.user){
			dispatch({
				type:LOGIN_SUCCESS,
				payload: storage.user
			})
		}
	}
}

export function doGoogleLoginAction() {
	return (dispatch, getState) => {
		dispatch({
			type:LOGIN
		})

		return loginWithGoogle()
			.then(user=> {
				dispatch({
					type: LOGIN_SUCCESS,
					payload:{ //...user -> trae toda la data
						uid:user.uid,
						displayName:user.displayName,
						email:user.email,
						photoURL:user.photoURL
						//token para redes sociales
					}
				})
				saveStorage(getState());
				retreiveFavs()(dispatch, getState)
			})
			.catch(e=> {
				console.log(e);
				dispatch({
					type: LOGIN_ERROR,
					payload:e.message
				})
			})				
	}
}