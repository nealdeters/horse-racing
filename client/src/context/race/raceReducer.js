import {
  SET_RACE,
  SET_TRACK,
  SET_RACERS,
  SET_RESULTS,
  CLEAR_RESULTS,
  ERROR
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case SET_RACE:
      return {
        ...state,
        race: action.payload
      };
    case SET_TRACK:
      console.log(action.payload)
      return {
        ...state,
        track: action.payload
      };
    case SET_RACERS:
      console.log(action.payload)
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