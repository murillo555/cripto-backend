const { Router } = require('express');
const { check } = require('express-validator');

//Default Data
const { users } = require('config').get('routes');
const { createPermissions, updatePermissions, deletePermissions, readPermissions } = require('config').get('permissionType');
//Controllers
const { usersGet, userRegister, activeUser, usersDelete, updateUser, adminUserAdd, updateUserPassword, updateUserByAdmin, userAuthGet } = require('../controllers/usersController');
//middlewares
const { UserRole, permission } = require('../middlewares/RoleValidation');
const { validationFields } = require('../middlewares/validation-fields');
const { jwtValidation } = require('../middlewares/webtokenValidation');
//Validaciones
const { roleValidation, emailValidation, userValidationById } = require('../database/db.validators');
//Ruta de Usuarios
const router = Router();
////////////////////////////////////Get////////////////////////////////////
router.get('/', [
    jwtValidation,
    permission(readPermissions, users),
    validationFields
], usersGet);

router.get('/auth', [
    jwtValidation,
    validationFields
], userAuthGet);

////////////////////////////////////Post////////////////////////////////////
router.post('/', [
    check('firstName', 'The name is required').notEmpty(),
    check('lastName', 'The name is required').notEmpty(),
    check('birthDate', 'Add a valid date for birthdate').isDate(),
    check('password', 'The password is RequireD').isLength({ min: 6 }),
    check('email', 'The email is not Valid').isEmail(),
    check('email').custom(emailValidation),
    check('role', 'you shall no pass brow :)').isEmpty(),
    validationFields
], userRegister);

router.post('/userbyadminpanel', [
    jwtValidation,
    permission(createPermissions, users),
    check('firstName', 'The name is required').notEmpty(),
    check('lastName', 'The name is required').notEmpty(),
    check('birthDate', 'Add a valid date for birthdate').isDate(),
    check('password', 'The password is RequireD').isLength({ min: 6 }),
    check('email', 'The email is not Valid').isEmail(),
    check('email').custom(emailValidation),
    check('role', 'Add the User role').notEmpty(),
    check('role').optional().custom(roleValidation).isMongoId(),
    validationFields
], adminUserAdd)

////////////////////////////////////Update////////////////////////////////////
router.put('/:id', [
    jwtValidation,
    permission(updatePermissions, users),
    check('id', 'Is not a valid mongoID').isMongoId(),
    check('id').custom(userValidationById),
    check('role').optional().custom(roleValidation),
    validationFields
], updateUserByAdmin);

router.put('/', [
    jwtValidation,
    UserRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'Is not a valid mongoID').isMongoId(),
    check('id').custom(userValidationById),
    check('role').optional().custom(roleValidation),
    validationFields
], updateUser);

router.put('/active/:id', [
    jwtValidation,
    UserRole('ADMIN_ROLE'),
    check('id', 'Is not a valid mongoID').isMongoId(),
    check('id').custom(userValidationById),
    validationFields
], activeUser);

router.put('/password', [
    jwtValidation,
    UserRole('ADMIN_ROLE', 'USER_ROLE'),
    check('password', 'The password is empty').notEmpty(),
    check('newPassword', 'The newPassword is empty').notEmpty(),
    validationFields
], updateUserPassword)

////////////////////////////////////Delete////////////////////////////////////
router.delete('/:id', [
    jwtValidation,
    permission(deletePermissions, users),
    check('id', 'Is not a valid mongoID').isMongoId(),
    check('id').custom(userValidationById),
    validationFields
], usersDelete);

module.exports = router;