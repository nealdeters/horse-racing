import React, { useReducer } from 'react';
import moment from 'moment';
import ResultContext from './resultContext';
import resultReducer from './resultReducer';
import {
  SET_RESULTS,
  CLEAR_RESULTS
} from '../types';

const ResultState = props => {
  const initialState = {
    results: null,
    error: null
  };

  const [state, dispatch] = useReducer(resultReducer, initialState);

  const setResults = (racers) => {
    let results = [];
    racers.forEach(racer => {
      let duration = moment(racer.endTime).diff(racer.startTime);
      let result = {
        rank: null,
        name: racer.name,
        racerId: racer.id,
        time: duration
      }
      results.push(result);
    })

    results.sort((a, b) => {
      if ( a.time < b.time) {
        return -1;
      }

      if ( a.time > b.time) {
        return 1;
      }

      return 0;
    })

    dispatch({
      type: SET_RESULTS,
      payload: results
    })
  }

  const clearResults = () => {
    dispatch({
      type: CLEAR_RESULTS
    })
  }

  return (
    <ResultContext.Provider
      value={{
        results: state.results,
        error: state.error,
        setResults,
        clearResults
      }}
    >
      {props.children}
    </ResultContext.Provider>
  );
};

export default ResultState;