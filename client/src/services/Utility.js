import clientIo from 'socket.io-client'
const io = clientIo(process.env.SOCKET_URL);

const Utility = {
	shuffle: (array) => {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	},
	randomInt: (min, max) => {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	io: () => {
		return io;
	},
	setBackgroundColor: (color) => {
		document.body.style = color ? 
			`background-color: ${color}` : 
			`background-color: SeaGreen`;
	},
	defaultBackgroundColor: () => {
		return {
	    backgroundColor: 'SeaGreen',
	    minHeight: `100%`
	  }
	}
}

export default Utility;