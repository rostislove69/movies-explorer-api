const router = require('express').Router();
const { validationUpdateUserInfo } = require('../middlewares/validator');

const {
  getUserProfile,
  updateUserInfo,
} = require('../controllers/users');

router.get('/me', getUserProfile);
router.patch('/me', validationUpdateUserInfo, updateUserInfo);

module.exports = router;
