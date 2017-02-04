import Config from 'react-native-config';

export const REQUEST_PLACES = 'REQUEST_PLACES';
export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export const SELECT_PLACE = 'SELECT_PLACE';
export const SET_PLACE_DETAILS = 'SET_PLACE_DETAILS';
export const SET_CURRENT_POSITION = 'SET_CURRENT_POSITION';
export const SET_PLACE_TYPE = 'SET_PLACE_TYPE';

export const TOGGLE_LOADING = 'TOGGLE_LOADING';
export const SUBMIT_REVIEW = 'SUBMIT_REVIEW';
export const SUBMIT_RATING = 'SUBMIT_RATING';

import * as firebase from 'firebase';
import { getPlaceRatings, getPlaceReviews, postPlaceReview, postPlaceRating } from '../services/firebase';
import { getPlaceDetails, getNearbyPlaces } from '../services/google';
import { calcRatings } from '../utils/ratings';

export const toggleLoading = (isLoading) => ({
	type: TOGGLE_LOADING,
	isLoading
});

export const requestPlaces = () => ({
    type: REQUEST_PLACES,
  });

export const receivePlaces = (json) => {
	return dispatch => {
		dispatch({
			type: RECEIVE_PLACES,
			places: Array.from(json.results)
		});
		dispatch(toggleLoading(false));
	}
};

export const fetchNearbyPlaces = (placeType) => {
	return dispatch => {
		dispatch(toggleLoading(true));
		dispatch(requestPlaces);

		// As Google Places Api has a request threshold, for development purposes,
		// we use stubbed data
		// if(Config.USE_STUBBED_DATA == 'true') {
		// 	dispatch(receivePlaces({ results: require('../../data/places.js').default }));
		// } else {
			getNearbyPlaces(placeType)
				.then(response => response.json())
				.then(json => dispatch(receivePlaces(json)))
				.catch(error => console.log(error))
		// }
	};
};

export const selectPlace = (placeId) => {
	debugger;
	return dispatch => {
	  Promise.all([
	  	getPlaceRatings(placeId),
	  	getPlaceReviews(placeId),
	  	getPlaceDetails(placeId)
	  ]).then(([ratings, reviews, details]) => {
	  	if(Config.USE_STUBBED_DATA == 'true') {
		  	details = require('../../data/placeDetails.js').default
		  }
		  let ratingRes = calcRatings(ratings);
		  let place = {
		  	ratings,
		  	ratingRes,
		  	details,
		  	reviews
		  };
		  place.id = placeId;
		  debugger;
	  	dispatch(setPlaceDetails(place));
	  }).catch(error => { console.log(error) });
	}
}

export const setPlaceDetails = (place) => ({
	type: SET_PLACE_DETAILS,
	place: place
});

export const submitReview = (placeId, review) => {
	return dispatch => {
		postPlaceReview(placeId, review)
			.then((res) => {
				review.id = res.name[0];
				dispatch({
					type: SUBMIT_REVIEW,
					review
				})
			})
			.catch((error) => { this.setState({text: error}) })
	}
};

export const submitRating = (placeId, rating) => {
	return dispatch => {
		postPlaceRating(placeId, rating)
			.then((res) => {
				rating.id = res.name[0];
				dispatch({
					type: SUBMIT_RATING,
					rating
				})
			})
			.catch((error) => { this.setState({text: error}) })
	}
};

export const setPlaceSearchType = (type) => {
	return dispatch => {
		dispatch({
			type: SET_PLACE_TYPE,
			placeType: type
		});
		dispatch(fetchNearbyPlaces(type));
	}
}

import {
	setSkippedAuth,
	authSuccess,
	logout,
	facebookLogin
} from './user';

export {
	setSkippedAuth,
	authSuccess,
	logout,
	facebookLogin
};

