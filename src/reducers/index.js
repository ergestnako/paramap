import { combineReducers } from 'redux';

import {
	SELECT_PLACE,
	SET_PLACE_DETAILS,
	REQUEST_PLACES,
	RECEIVE_PLACES,
	SET_CURRENT_POSITION,
  TOGGLE_LOADING
} from '../actions';
import{ user, isAuthenticated } from './user';

var initialState = {
	selectedPlaceId: '',
	currentPosition: {
		longitude: '',
		latitude: ''
	},
	nearbyPlaces: []
}

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

function selectedPlace(state = null, action) {
	switch(action.type){
		case SET_PLACE_DETAILS:
			let place = Object.assign({}, state, action.place)
			return place;
		default:
			return state;
	}
}

function currentPosition(state = { latitude: LATITUDE, longitude: LONGITUDE }, action) {
  switch(action.type) {
		case SET_CURRENT_POSITION:
			let position = Object.assign({}, state, {
				latitude: action.position.latitude,
				longitude: action.position.longitude
			});
			return position;
		default:
			return state;
	}
}

function nearbyPlaces( state = initialState.nearbyPlaces, action){
  switch(action.type){
    case RECEIVE_PLACES:
      return action.places;
    default:
      return state;
  }
}

function isLoading( state = false, action) {
  switch(action.type) {
    case TOGGLE_LOADING:
      return action.isLoading;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  currentPosition,
  selectedPlace,
  nearbyPlaces,
  user,
  isAuthenticated,
  isLoading
});

export default rootReducer;