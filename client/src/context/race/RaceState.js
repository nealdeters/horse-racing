import React, { useReducer } from 'react';
import RaceContext from './raceContext';
import raceReducer from './raceReducer';
import {
  SET_RACE,
  SET_TRACK,
  SET_RACERS,
  SET_RESULTS,
  CLEAR_RESULTS
} from '../types';

const defaultTrack = {
  name: 'Park Hills',
  trackColor: 'SeaGreen',
  groundColor: 'SandyBrown',
  railColor: 'Black',
  distance: 20
}

const RaceState = props => {
  const initialState = {
    race: null,
    racers: [],
    track: defaultTrack,
    results: null,
    error: null,
    loading: null
  };

  const [state, dispatch] = useReducer(raceReducer, initialState);

  const setRace = async (race) => {
    if(race){
      if(race.Track){
        if(race.Track !== state.track){
          setTrack(race.Track);
        }
      } else {
        setTrack(defaultTrack);
      }

      if(race.racers.length){
        setRacers(race.racers);
      } else {
        setRacers([]);
      }

      dispatch({
        type: SET_RACE,
        payload: race
      });
    }
  }

  const setTrack = async (track) => {
    dispatch({
      type: SET_TRACK,
      payload: track
    })
  }
  
  const setRacers = async (racers) => {
    dispatch({
      type: SET_RACERS,
      payload: racers
    })
  }

  const setResults = (results) => {
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
        race: state.race,
        track: state.track,
        racers: state.racers,
        results: state.results,
        loading: state.loading,
        setRace,
        setTrack,
        setRacers,
        setResults,
        clearResults
      }}
    >
      {props.children}
    </RaceContext.Provider>
  );
};

export default RaceState;