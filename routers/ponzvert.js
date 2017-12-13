const express = require('express');
const app = express();
const router = express.Router();
const User = require('./../models/User');
const mongoose = require('mongoose');
const passport = require('passport');

router.get('/', (req, res) => {
  res.redirect('/');
});

router.get('/:id', (req, res) => {
  res.redirect(`/register/${req.params.id}`);
});

module.exports = router;
