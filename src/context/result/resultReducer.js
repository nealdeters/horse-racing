import {
  SET_RESULTS,
  CLEAR_RESULTS
} from '../types';

export default (state, action) => {
  switch (action.type) {
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