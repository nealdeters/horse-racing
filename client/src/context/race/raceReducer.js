import {
  SET_TRACK,
  SET_RACERS,
  SET_RESULTS,
  CLEAR_RESULTS
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case SET_TRACK:
      return {
        ...state,
        track: action.payload
      };
    case SET_RACERS:
      return {
        ...state,
        racers: action.payload
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
    default:
      return state;
  }
};