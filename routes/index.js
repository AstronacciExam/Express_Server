const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/', (req, res) => {
  res.status(200).json('Server node is running');
});
router.post('/login-user', controllers.UserController.LoginUser);
router.post('/register-user', controllers.UserController.RegisterUser);

router.post('/login-social-media', controllers.UserController.LoginSocialMedia);

module.exports = router;