import React, { Fragment, useRef, useState, useEffect } from 'react';
import RaceWinner from './RaceWinner';
import ResultsBoard from './ResultsBoard';
import { Modal } from 'react-materialize';
import Utility from '../services/Utility';
const io = Utility.io();

const Results = (props) => {
	const [show, setShow] = useState(false);
	const [results, setResults] = useState(null);
	const isMountedRef = useRef(null);

	// on mount
	useEffect(() => {
    isMountedRef.current = true;
    io.on("liveRace", data => {
      if(isMountedRef.current){
      	liveRace(data.race);
      }
    });

    // on dismount
    return () => {
      io.off('liveRace');
      isMountedRef.current = false;
    };

    // eslint-disable-next-line
	}, []);

	const liveRace = (data) => {
		if(data && data.finished){
			setShow(false);
			setResults(data.racers);
		}
	}

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
				  style={{backgroundColor: '#191919'}}
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
				  	<Fragment>
				  		<RaceWinner racers={results}/>
				  		<ResultsBoard id="results-board" results={results}/>
				  	</Fragment>
				  )}
				</Modal>
			) : null}
		</Fragment>
	);
}

export default Results