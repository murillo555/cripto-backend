const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/authController');
const { validationFields } = require('../middlewares/validation-fields');


const router = Router();


router.post('/login', [
    check('email', 'The email is invalid').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    validationFields
], login);

router.post('/google', [
    check('id_token', 'id_token is required').not().isEmpty(),
    validationFields
], googleSignin);


module.exports = router;