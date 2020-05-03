const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const pool = require('../config/db');

// @route 	GET api/users
// @desc 		Get all users
// @access	Public
router.get('/', [], async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users ORDER BY id ASC', []);
  res.json(rows);
})

module.exports = router;