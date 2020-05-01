import React, { Fragment, useState, useEffect, useContext } from 'react';
import ResultsBoard from './ResultsBoard';
import ResultContext from '../context/result/resultContext';
import { Modal, Button } from 'react-materialize';

const Results = (props) => {
	
	const resultContext = useContext(ResultContext);
	const { results } = resultContext;
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

	if(results === null){
		return null;
	}

	return (
		<Fragment>
			{ show ? (
				<Modal
				  style={{backgroundColor: props.track.colors.track}}
				  actions={[
				    <Button 
				    	waves="light"
				    	flat={true}
				    	className="grey darken-3 white-text"
				    	modal="close"
				    	node="button">Close</Button>
				  ]}
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
				    onCloseEnd: null,
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