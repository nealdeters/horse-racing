import React, { Fragment, useState, useEffect, useContext } from 'react';
import ResultsBoard from './ResultsBoard';
import RaceContext from '../context/race/raceContext';
import { Modal } from 'react-materialize';

const Results = (props) => {
	const raceContext = useContext(RaceContext);
	const { track, results, clearResults } = raceContext;
	const [show, setShow] = useState(false);

	useEffect(() => {
		if(results && results.length){
			setShow(true);
		} else {
			setShow(false);
		}

		return () => {
      // console.log('Do some cleanup');
      setShow(false);
    }
	}, [results]);

	const onClose = () => {
		clearResults();
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