import React, { useReducer } from 'react';
import moment from 'moment';
import RaceContext from './raceContext';
import raceReducer from './raceReducer';
import Utility from '../../Utility';
// import racersJson from '../../racers.json';
// import tracksJson from '../../tracks.json'
import {
  SET_TRACK,
  SET_TRACK_RACERS,
  SET_RESULTS,
  CLEAR_RESULTS,
  GET_RACERS,
  GET_TRACKS,
  ERROR,
  SET_LOADING
} from '../types';

const RaceState = props => {
  const initialState = {
    racers: null,
    tracks: null,
    trackRacers: null,
    track: null,
    results: null,
    error: null,
    loading: null
  };

  const [state, dispatch] = useReducer(raceReducer, initialState);

  const setTrackRacers = async (trackRacers) => {
    if(!trackRacers){
      trackRacers = Utility.shuffle(state.racers.map((racer, index) => {
        racer.startTime = null;
        racer.endTime = null;
        racer.percentage = 0;
        racer.finished = false;
        racer.injured = false;
        return racer;
      }));

      trackRacers.forEach((racer, index) => {
        racer.lane = index + 1;
      });
    }

    dispatch({
      type: SET_TRACK_RACERS,
      payload: trackRacers
    })
  }

  const getRacers = async () => {
    try {
      setLoading();

      const res = await fetch('api/racers');
      let data = await res.json();

      dispatch({
        type: GET_RACERS,
        payload: data
      });
    } catch (err) {
      dispatch({
        type: ERROR,
        payload: err.response
      });
    }
  }

  const getTracks = async (setTheTrack) => {
    try {
      setLoading();

      const res = await fetch('api/tracks');
      let data = await res.json();

      dispatch({
        type: GET_TRACKS,
        payload: data
      });
    } catch (err) {
      dispatch({
        type: ERROR,
        payload: err.response
      });
    }
  }

  const setTrack = async () => {
    const track = Utility.shuffle(state.tracks)[0];

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
        primaryColor: racer.primaryColor,
        secondaryColor: racer.secondaryColor,
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

  const setLoading = () => {
    dispatch({
      type: SET_LOADING
    })
  }

  return (
    <RaceContext.Provider
      value={{
        racers: state.racers,
        trackRacers: state.trackRacers,
        tracks: state.tracks,
        track: state.track,
        results: state.results,
        loading: state.loading,
        setTrackRacers,
        setTrack,
        setResults,
        clearResults,
        getRacers,
        getTracks
      }}
    >
      {props.children}
    </RaceContext.Provider>
  );
};

export default RaceState;