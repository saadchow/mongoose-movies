const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.redirect('/movies');
});

// LOGIN
// eslint-disable-next-line prettier/prettier
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
))

// AUTH CALLBACK ROUTE
// Google OAuth callback route
router.get(
  '/oauth2callback',
  passport.authenticate('google', {
    successRedirect: '/movies',
    failureRedirect: '/movies',
  })
);

// LOGOUT
// OAuth logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/movies');
  });
});

module.exports = router;
