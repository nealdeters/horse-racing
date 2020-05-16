const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const login = (req, res, next) => {
  passport.authenticate('login', (err, users, info) => {
    if (err) {
      console.error(`error ${err}`);
    }
    if (info !== undefined) {
      console.error(info.message);
      if (info.message === 'bad username') {
        res.status(401).send(info.message);
      } else {
        res.status(403).send(info.message);
      }
    } else {
      req.logIn(users, () => {
        User.findOne({
          where: {
            email: req.body.email,
          },
        }).then(user => {
          const token = jwt.sign(
            { id: user.id }, 
            process.env.PASSPORT_JWT_SECRET, 
            {
              expiresIn: 60 * 60,
            }
          );
          res.status(200).send({
            token,
            msg: 'User logged in.',
          });
        });
      });
    }
  })(req, res, next);
}

const logout = (req, res, next) => {
  req.logout();
  return res.status(200).send("User has been logged out.");
}

const register = (req, res, next) => {
  passport.authenticate('register', (err, user, info) => {
    if (err) {
      console.error(err);
    }
    if (info !== undefined) {
      res.status(403).send(info.message);
    } else {
      req.logIn(user, error => {
        res.status(200).json({ 
          msg: "User registered",
          user: user
        });
      });
    }
  })(req, res, next);
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id: id }
    });
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).send('User with the specified ID does not exists');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [ updated ] = await User.update(req.body, {
      where: { id: id }
    });
    if (updated) {
      const updatedUser = await User.findOne({ where: { id: id } });
      return res.status(200).json(updatedUser);
    }
    throw new Error('User not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  register,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser
}