const express = require('express');
const passport = require('../config/passport');
const { registerUser, loginUser, getUser, user, users } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser', getUser);
router.get('/user',verifyToken,user);
router.get('/users',users);

router.get('/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: '/login',
}), (req, res) => {
  const token = req.user.token;
  const redirectUrl = `http://localhost:5173/auth/success?token=${token}`;
  res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
