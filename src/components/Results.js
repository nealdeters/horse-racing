import React, {useState, useEffect, useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ResultsBoard from './ResultsBoard';
import ResultContext from '../context/result/resultContext';

const Results = (props) => {
	
	const resultContext = useContext(ResultContext);
	const { results } = resultContext;

	useEffect(() => {
		if(results && results.length){
			setShow(true);
		}
	}, [results]);

	const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

	return (
		<Modal show={show} onHide={handleClose}>
		  <Modal.Header closeButton>
		    Race Results
		  </Modal.Header>
		  <Modal.Body style={{backgroundColor: props.track.colors.track}}>
		    <ResultsBoard />
		  </Modal.Body>
		  <Modal.Footer>
		    <Button 
		      variant="secondary" 
		      onClick={handleClose}>Close</Button>
		  </Modal.Footer>
		</Modal>
	);
}

export default Results