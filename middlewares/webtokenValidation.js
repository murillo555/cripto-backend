const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { logger } = require('../libs/logger');

/**
 * This middleware is for validate users token 
 * @return {string} token
 * @author Gabriel Murillo
 */
const jwtValidation = async(req = request, res = response, next) => {
    const token = req.header('xtoken')
    logger.debug(token)
    if (!token) return res.status(401).json({ msg: 'Petition without token' });
    logger.info('[middlewares, jwtValidation], jwt: ' + token)
    try {
        const { uid } = await jwt.verify(token, process.env.SECRETPRIVATEKEY);
        AuthUser = await User.findById(uid);
        if (!AuthUser) return res.status(401).json({ msg: 'Invalid Token' })

        if (!AuthUser.status) return res.status(401).json({ msg: 'Invalid Token' })
        req.user = AuthUser;
        logger.silly(req.user);
        next();
    } catch (error) {
        logger.error('(middlewares, jwtValidation)', error);
        res.status(401).json({ msg: 'Invalid Token' })
    }

};

module.exports = {
    jwtValidation
}