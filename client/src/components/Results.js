import React, { Fragment, useState, useEffect } from 'react';
import ResultsBoard from './ResultsBoard';
// import RaceContext from '../context/race/raceContext';
import { Modal } from 'react-materialize';
import socketIOClient from "socket.io-client";

let io = socketIOClient(process.env.SOCKET_URL);

const Results = (props) => {
	const [show, setShow] = useState(false);
	const [results, setResults] = useState(null);
	const [track, setTrack] = useState(null);

	// on mount
	useEffect(() => {
    io.on("raceResults", data => {
      if(data && data.finished){
      	setResults(data.racers);
      	setTrack(data.Track);
      }
    });

    // eslint-disable-next-line
	}, []);

	useEffect(() => {
		if(results && results.length){
			setShow(true);
		} else {
			setShow(false);
		}

		return () => {
      setShow(false);
    }
	}, [results])

	const onClose = () => {
		setResults(null);
	}

	if(results === null){
		return null;
	}

	return (
		<Fragment>
			{ show ? (
				<Modal
				  style={{backgroundColor: track.trackColor}}
				  bottomSheet
				  large="true"
				  fixedFooter={false}
				  header="Race Results"
				  id="results-modal"
				  root={document.getElementById('root')}
				  open={show}
				  options={{
				    dismissible: true,
				    endingTop: '10%',
				    inDuration: 250,
				    onCloseEnd: onClose,
				    onCloseStart: null,
				    onOpenEnd: null,
				    onOpenStart: null,
				    opacity: 0.5,
				    outDuration: 250,
				    preventScrolling: true,
				    startingTop: '15%'
				  }}
				> 
					{ results === null ? null : (
				  	<ResultsBoard id="results-board" results={results}/>
				  )}
				</Modal>
			) : null}
		</Fragment>
	);
}

export default Results