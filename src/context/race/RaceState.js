import React, { useReducer } from 'react';
import moment from 'moment';
import RaceContext from './raceContext';
import raceReducer from './raceReducer';
import Utility from '../../Utility';
import racersJson from '../../racers.json';
import tracksJson from '../../tracks.json'
import {
  SET_TRACK,
  SET_RACERS,
  SET_RESULTS,
  CLEAR_RESULTS
} from '../types';

const RaceState = props => {
  const initialState = {
    racers: null,
    track: null,
    results: null
  };

  const [state, dispatch] = useReducer(raceReducer, initialState);

  const setRacers = (racers) => {
    if(!racers){
      racers = Utility.shuffle(racersJson.map((racer, index) => {
        racer.startTime = null;
        racer.endTime = null;
        racer.percentage = 0.25;
        racer.finished = false;
        racer.injured = false;
        return racer;
      }));

      racers.forEach((racer, index) => {
        racer.lane = index + 1;
      })
    }

    dispatch({
      type: SET_RACERS,
      payload: racers
    })
  }

  const setTrack = () => {
    const track = Utility.shuffle(tracksJson)[0]
    dispatch({
      type: SET_TRACK,
      payload: track
    })
  }

  const setResults = (racers) => {
    let results = [];
    racers.forEach((racer, index) => {
      let duration = moment(racer.endTime).diff(racer.startTime);
      let result = {
        rank: null,
        name: racer.name,
        colors: racer.colors,
        id: racer.id,
        injured: racer.injured,
        time: isNaN(duration) ? null : duration,
        lane: racer.lane
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
    <RaceContext.Provider
      value={{
        racers: state.racers,
        track: state.track,
        results: state.results,
        setRacers,
        setTrack,
        setResults,
        clearResults
      }}
    >
      {props.children}
    </RaceContext.Provider>
  );
};

export default RaceState;