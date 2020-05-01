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
        colors: racer.colors,
        racerId: racer.id,
        injured: racer.injured,
        time: isNaN(duration) ? null : duration
      }
      results.push(result);
    })

    results.sort((a, b) => {
      // nulls sort after anything else
      if (a.time === null) {
        return 1;
      } else if (b.time === null) {
        return -1;
      } else if ( a.time < b.time) {
        return -1;
      } else if ( a.time > b.time) {
        return 1;
      } else {
        return 0;
      }
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