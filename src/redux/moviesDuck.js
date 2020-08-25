import axios from 'axios'
import { updateDB, getFavs } from '../firebase'
import ApolloClient, {gql} from 'apollo-boost'


//constantes
let initialData = {
	fetching: false,
	array: [],
	current: {},
	favorites: [],
	nextPage:1
}

//let URL = "https://rickandmortyapi.com/api/character"
let URL = "https://api.themoviedb.org/3/search/movie?api_key=307a6b443337a1601d478e622746d168&query=xfiles"

/*let client = new ApolloClient({
	uri: "https://rickandmortyapi.com/graphql"
})*/

let UPDATE_PAGE = "UPDATE_PAGE";

let GET_MOVIES = "GET_MOVIES";
let GET_MOVIES_SUCCESS = "GET_MOVIES_SUCCESS";
let GET_MOVIES_ERROR = "GET_MOVIES_ERROR";

let REMOVE_MOVIE = "REMOVE_MOVIE";

let ADD_TO_FAVORITES = "ADD_TO_FAVORITES";

let GET_FAVS = "GET_FAVS";
let GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS";
let GET_FAVS_ERROR = "GET_FAVS_ERROR";

//reducer
export default function reducer(state=initialData, action){
	switch(action.type){

		case UPDATE_PAGE:
			return {...state, nextPage:action.payload}

		case GET_FAVS:
			return {...state, fetching:true}

		case GET_FAVS_ERROR:
			return {...state, fetching:false, error:action.payload}

		case GET_FAVS_SUCCESS:
			return {...state, favorites:action.payload, fetching:false}

		case ADD_TO_FAVORITES:
			return {...state, ...action.payload}

		case REMOVE_MOVIE:
			return {...state, array:action.payload}

		case GET_MOVIES:
			return {...state, fetching: true}

		case GET_MOVIES_ERROR:
			return {...state, fetching:false, error: action.payload}

		case GET_MOVIES_SUCCESS:
			return {...state, array:action.payload, fetching: false }
		
		default:
			return state;
			
	}
}

//function aux

//Para guardar en localStorage los favs de cada usuario y no desaparezcan al refresh 
function saveStorage(storage){
	localStorage.storage = JSON.stringify(storage);
}

//Trae los favs desde Firebase
export function retreiveFavs(){
	return (dispatch, getState) => {
		dispatch({
			type: GET_FAVS
		})
		let {uid} = getState().user
		return getFavs(uid)
		.then(array=>{
			dispatch({
				type:GET_FAVS_SUCCESS,
				payload: [...array]
			})
		})
		.catch(e=> {
			console.log(e)
			dispatch({
				type:GET_FAVS_ERROR,
				payload:e.message
			})})
	}
}

//actions (thunks) 

export function restoreFavsAction () {
	return (dispatch) => {
		let storage = localStorage.getItem('storage');
		storage = JSON.parse(storage);
		if(storage && storage.movies){
			dispatch({
				type:GET_FAVS_SUCCESS,
				payload: storage.movies.favorites
			})
		}
	}
}

export function addToFavoritesAction(){
	return (dispatch, getState) => {
		let {array, favorites} = getState().movies;
		let char = array.shift();
		let {uid} = getState().user
		favorites.push(char);
		updateDB(favorites, uid)
		dispatch({
			type: ADD_TO_FAVORITES,
			payload:{ array:[...array], favorites:[...favorites] } //objeto que trae ambos arrays
		})
		saveStorage(getState());
	}
}
//No se comunica con el Back-End por lo que no precisa 3 aspectos: SUCCESS, ERROR
export function removeMoviesAction() {
	//getState posibilita traer data del STORE
	return (dispatch, getState) => {
		let {array} = getState().movies;
		array.shift();
		if (!array.length){
			getMoviesAction()(dispatch, getState)
		}
		dispatch({
			type: REMOVE_MOVIE,
			payload: [...array]
		})
	}
}

export function getMoviesAction(){
	return (dispatch, getState) => {

		dispatch({
			type: GET_MOVIES
		})

		return axios.get(URL)
			.then(res => {
				dispatch({
					type: GET_MOVIES_SUCCESS,
					payload: res.data.results
				})
			})
			.catch(err=> {
				console.log(err);
				dispatch({
					type: GET_MOVIES_ERROR,
					payload: err.response.message
				})
			})
	}	
}