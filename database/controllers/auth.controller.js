const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
		// we get the user with the email and save the resolved promise
		let user = await User.findByEmail(email);
		if (!user) {
		  res.status(401).json({ msg: 'No such user found', user });
		}

   	if (User.validPassword(password)){
      // from now on we’ll identify the user by the id and the id is// the only personalized value that goes into our token
      let payload = { id: user.id };
      let token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ msg: 'ok', token: token });
    } else {
      res.status(401).json({ msg: 'Password is incorrect' });
    }
  }
}

const logout = (req, res) => {
  req.logout();
  return res.status(200).send("User logged out.");
}

module.exports = {
  login,
  logout
}