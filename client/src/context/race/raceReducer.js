import {
  SET_TRACK,
  SET_TRACK_RACERS,
  SET_RESULTS,
  CLEAR_RESULTS,
  GET_RACERS,
  GET_TRACKS,
  SET_LOADING,
  ERROR
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case SET_TRACK:
      return {
        ...state,
        track: action.payload
      };
    case SET_TRACK_RACERS:
      return {
        ...state,
        trackRacers: action.payload
      };
    case GET_RACERS:
      return {
        ...state,
        racers: action.payload,
        loading: false
      };
    case GET_TRACKS:
      return {
        ...state,
        tracks: action.payload,
        loading: false
      };
    case SET_RESULTS:
      return {
        ...state,
        results: action.payload
      };
    case CLEAR_RESULTS:
      return {
        ...state,
        results: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case ERROR:
      console.error(action.payload);
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};