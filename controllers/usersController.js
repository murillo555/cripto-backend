const { response, request } = require('express');
const dayjs = require('dayjs')
const { User, Role, TimeLine } = require('../models');
const bcrypt = require('bcryptjs');
const { logger } = require('../libs/logger');
const { dataBase, entityNoExists, entityDelete, entityCreate, entityUpdate, paramsError } = require('config').get('message');
const DEFAULT_ROLE = 'DEFAULT_ROLE'

/**
 * This method is for get a list of Users
 * @param {number} page
 * @param {number} limit
 * @param {boolean} status   
 * @return {json} json String
 * @author Gabriel Murillo
 */
const usersGet = async(req = request, res = response) => {
    logger.verbose('[Users, usersGet]', 'Get Users List');
    let page = req.query.page || 1;
    const { limit = 10 } = req.query;
    page = page - 1;
    const since = page * 10;
    const query = { status: true };
    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).populate('role', '-__v')
        .skip(Number(since))
        .limit(Number(limit))
    ])
    logger.debug(`Total Users: ${total}`)
    res.json({ total, users });
};

/**
 * This method is for add a user by admin panel
 * @param {userData} req.body
 * @return {json} json String
 * @author Gabriel Murillo 
 */
const adminUserAdd = async(req, res = response) => {
    logger.verbose('[Users, adminUserAdd]', 'Create a user on the admin panel)')

    req.body.birthDate = dayjs(req.body.birthDate, 'YYYY-MM-DD').toDate()
    const { firstName, lastName, birthDate, email, password, role, entryDate, nss, rfc, address, personalEmail, salary, baseCommission } = req.body;

    const user = new User({ firstName, lastName, birthDate, email, password, role, entryDate, nss, rfc, address, personalEmail, salary, baseCommission });

    const salt = await bcrypt.genSaltSync();
    user.password = await bcrypt.hashSync(password, salt);

    logger.info(user);

    user.save()
        .then((response) => {
            logger.debug(response);
            const event = {
                date: dayjs().toDate(),
                actionType: 'CREATE',
                target: 'User',
                actionBy: req.user._id,
                actionDescription: `User ${response.firstName} ${response.lastName} Created`
            }
            TimeLine.create(event)
            return res.json(entityCreate)
        })
        .catch(err => {
            logger.error('[Users, adminUserAdd]', err)
            res.status(501).json(dataBase)
        })
}

/**
 * This method is to get a user by id
 * @param {MongoId} idUser 
 * @return {json} json String
 * @author Gabriel Murillo
 */
const userRegister = async(req, res = response) => {
    logger.verbose('[Users, userRegister]', 'Create a user)')
    const { firstName, lastName, birthDate, email, password } = req.body;
    const role = await Role.findOne({ role: DEFAULT_ROLE })
    const user = new User({ firstName, lastName, birthDate, email, password, role: role._id });
    const salt = await bcrypt.genSaltSync();
    user.password = await bcrypt.hashSync(password, salt);

    user.save()
        .then((response) => {
            logger.debug(response);
            const event = {
                date: dayjs().toDate(),
                actionType: 'CREATE',
                target: 'User',
                actionBy: response._id,
                actionDescription: `User ${response.firstName} ${response.lastName} Registered`
            }
            TimeLine.create(event)
            res.json(entityCreate)
        })
        .catch(err => {
            logger.error('[Users,userRegister]', err)
            res.status(501).json(dataBase)
        })
}

/**
 * This method is to update a user by self
 * @param {MongoId} idUser 
 * @param {updateData} req.body
 * @return {json} json String
 * @author Gabriel Murillo
 */
const updateUser = async(req, res = response) => {
    logger.verbose('[Users, updateUser]', 'Update user by id')
    const _id = req.user._id;
    const { password, google, ...rest } = req.body;
    //VALIDAR
    if (password) {
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }
    User.findByIdAndUpdate(_id, rest)
        .then((response) => {
            const event = {
                date: dayjs().toDate(),
                actionType: 'UPDATE',
                target: 'User',
                actionBy: req.user._id,
                actionDescription: `User ${response.firstName} ${response.lastName} updated`
            }
            TimeLine.create(event)
            res.json(entityUpdate)
        })
        .catch(err => {
            logger.error('[Users,Update]', err)
            res.status(500).json(dataBase)
        })
}

/**
 * This method is to update a user by self
 * @param {MongoId} idUser 
 * @param {updateData} req.body
 * @return {json} json String
 * @author Gabriel Murillo
 */
const updateUserPassword = (req, res = response) => {
    logger.verbose('[Users, updateUserPassword]', 'Update user password')
    const _id = req.user._id;
    const { password, newPassword } = req.body;
    if (!password && !newPassword) return res.status(500).json(paramsError)
    User.findById(_id)
        .then(user => {
            if (bcrypt.compareSync(password, user.password)) {
                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(newPassword, salt);
                user.save()
                    .then((response) => {
                        const event = {
                            date: dayjs().toDate(),
                            actionType: 'UPDATE',
                            target: 'User',
                            actionBy: response._id,
                            actionDescription: `User ${response.firstName} ${response.lastName} password updated`
                        }
                        TimeLine.create(event)
                        res.json(entityUpdate)
                    })
                    .catch(err => {
                        logger.error('[Users,updateUserPassword]', err)
                        res.status(500).json(dataBase)
                    })
            } else {
                return res.status(400).json(paramsError)
            }
        })
        .catch(err => {
            logger.error('[Users,updateUserPassword]', err)
            res.status(500).json(dataBase)
        })
}

/**
 * This method is to update a user by id
 * @param {MongoId} req.user._id
 * @param {updateData} req.body
 * @return {json} json String
 * @author Gabriel Murillo
 */

const updateUserByAdmin = async(req, res = response) => {
    logger.verbose('[Users, updateUserByAdmin]', 'Update user by admin')
    const { id } = req.params;
    logger.info(`User _id: ${id}`)
    const { password, google, ...rest } = req.body;
    //VALIDAR
    if (password) {
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }
    const event = {
        date: dayjs().toDate(),
        actionType: 'UPDATE',
        target: 'User',
        actionBy: req.user._id,
        actionDescription: `User ${response.firstName} ${response.lastName} updated by admin`
    }
    TimeLine.create(event)
    User.findByIdAndUpdate(id, rest)
        .then(() => res.json(entityUpdate))
        .catch(err => {
            logger.error('[Users,updateUserByAdmin]', err)
            res.status(500).json(dataBase)
        })
}

/**
 * This method is to active a user by id
 * @param {MongoId} idUser 
 * @return {json} json String
 * @author Gabriel Murillo
 */
const usersDelete = async(req, res = response) => {
    logger.verbose('[Users, usersDelete]', 'Delete a user by id');
    const { id } = req.params;
    logger.info(`User _id: ${id}`);
    try {
        await User.findByIdAndUpdate(id, { status: false });
        const event = {
            date: dayjs().toDate(),
            actionType: 'DELETE',
            target: 'User',
            actionBy: req.user._id,
            actionDescription: `User ${response.firstName} ${response.lastName} deleted`
        }
        await TimeLine.create(event)
        res.status(200).json(entityDelete)
    } catch (error) {
        logger.error('[Users,usersDelete]', error);
        res.status(500).json(dataBase);
    }
}

/**
 * This method is to delete a user by id
 * @param {MongoId} idUser 
 * @return {json} json String
 * @author Gabriel Murillo
 */
const activeUser = (req, res = response) => {
    logger.verbose('[Users, activeUser]', 'Active a user by id');
    const { id } = req.params;
    logger.info(`User _id: ${id}`);
    User.findByIdAndUpdate(id, { status: true })
        .then(user => {
            if (!user) return res.status(500).json(entityNoExists)
            const event = {
                date: dayjs().toDate(),
                actionType: 'ACTIVE',
                target: 'User',
                actionBy: req.user._id,
                actionDescription: `User ${response.firstName} ${response.lastName} activated`
            }
            TimeLine.create(event)
        })
        .catch(err => {
            logger.error('[Users,activeUser]', err);
            res.status(500).json(dataBase);
        })
}

const userAuthGet = async(req, res = response) => {
    logger.verbose('[Users, userAuthGet]', 'get auth user');
    try {
        const user = await User.findById(req.user._id).populate('role', '-__v');
        const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        }
        res.json({ userData, status: true })
    } catch (error) {
        logger.error('[Users, userAuthGet]', error);
        res.status(500).json(dataBase);
    }
}

module.exports = {
    usersGet,
    updateUser,
    updateUserByAdmin,
    updateUserPassword,
    userRegister,
    usersDelete,
    activeUser,
    adminUserAdd,
    updateUserPassword,
    userAuthGet
}