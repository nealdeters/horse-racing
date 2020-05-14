const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
  	const { email, password } = req.body;
  	const user = await User.findOne({where: { email }});

    if (!user){
			return res.status(400).json({ msg: "User not found." })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let payload = { id: user.id };
      let token = jwt.sign(payload, process.env.PASSPORT_JWT_SECRET);
      return res.status(200).json({ 
      	msg: 'User login successful.', 
      	token: token 
     	})
    } else {
      return res.status(401).json({ msg: "Invalid password." })
    }
  } catch(error){
  	return res.status(500).send(error.message);
  }
}

const logout = (req, res) => {
  req.logout();
  return res.status(200).send("User has been logged out.");
}

module.exports = {
  login,
  logout
}