const { Schema, model } = require('mongoose');
const { permissionList } = require('config')

const RoleSchema = Schema({
    role: {
        type: String,
        required: [true, 'The role is required']
    },
    createPermissions: {
        type: [String],
        enum: permissionList,
        default: [],
    },
    updatePermissions: {
        type: [String],
        enum: permissionList,
        default: []
    },
    deletePermissions: {
        type: [String],
        enum: permissionList,
        default: []

    },
    readPermissions: {
        type: [String],
        enum: permissionList,
        default: []
    },
    priority: {
        type: Number,
        default: 0
    }
});


module.exports = model('Role', RoleSchema);