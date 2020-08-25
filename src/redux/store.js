import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import userReducer, { restoreSessionAction } from './userDuck'
import moviesReducer, {getMoviesAction, restoreFavsAction} from './moviesDuck'
import thunk from 'redux-thunk'


let rootReducer = combineReducers({
	user: userReducer,
	movies: moviesReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore(){
	let store = createStore(
		rootReducer, 
		composeEnhancers(applyMiddleware(thunk))
		)
	// Traigo personajes por primera vez
	getMoviesAction()(store.dispatch, store.getState)
	// Guardo la data del User LoggedIn
	restoreSessionAction()(store.dispatch)
	// Guardo la data de Favs correspondiente al User
	restoreFavsAction()(store.dispatch)
	return store
}