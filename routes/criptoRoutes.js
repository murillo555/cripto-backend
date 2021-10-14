const { Router } = require('express');
const { check } = require('express-validator');

//Default Data
const { currency } = require('config').get('routes');
const { createPermissions, updatePermissions, deletePermissions, readPermissions } = require('config').get('permissionType');
//Controllers
const { criptoAssets, addCriptoCurrency, getCriptoCurrency, addInvestment, getInvestment } = require('../controllers/criptoController');
//middlewares
const { permission } = require('../middlewares/RoleValidation');
const { validationFields } = require('../middlewares/validation-fields');
const { jwtValidation } = require('../middlewares/webtokenValidation');
//Ruta de Usuarios
const router = Router();
/////////GET////////////
router.get('/', [
    jwtValidation,
    permission(readPermissions, currency),
    validationFields
], criptoAssets);

router.get('/investment', [
    jwtValidation,
    permission(readPermissions, currency),
    validationFields
], getInvestment);

router.get('/cripto', [
    jwtValidation,
    permission(readPermissions, currency),
    validationFields
], getCriptoCurrency)

/////////POST////////////
router.post('/cripto', [
    jwtValidation,
    check('slug').isString(),
    check('symbol').isString(),
    check('name').isString(),
    permission(createPermissions, currency),
    validationFields
], addCriptoCurrency)

router.post('/', [
    jwtValidation,
    check('currency').isMongoId(),
    check('investment').isNumeric(),
    permission(createPermissions, currency),
    validationFields
], addInvestment)
module.exports = router;