const { User, Role } = require('../models/index')
const { paramsError, entityExists } = require('config').get('message');
const { permissionList } = require('config')
    //Users
const emailValidation = async(email = '') => {
    const emailvalidation = await User.findOne({ email });
    if (emailvalidation) {
        throw new Error(`${entityExists.msg}`)
    }
};
const userValidationById = async(id = '') => {
    const userValidation = await User.findById(id);
    if (!userValidation) {
        throw new Error(`${paramsError.msg}`)
    }
};
//Roles
const uniqueRoleValidation = async(role = '') => {
    const rolValidation = await Role.findOne({ role });
    if (rolValidation) {
        throw new Error(`${entityExists.msg}`)
    }
};
const roleValidation = async(role = '') => {
    const rolValidation = await Role.findById(role);
    if (!rolValidation) throw new Error(`${paramsError.msg}`)
};
const roleRoutesValidation = async(routes = []) => {
    const validation = await routes.every(routes => permissionList.includes(routes));
    if (!validation) throw new Error(`${paramsError.msg}`)
}

module.exports = {
    roleValidation,
    emailValidation,
    userValidationById,
    uniqueRoleValidation,
    roleRoutesValidation
}