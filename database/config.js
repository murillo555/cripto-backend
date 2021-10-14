const mongoose = require('mongoose');
const { logger } = require('../libs/logger');

const connection = async() => {
    try {
        logger.verbose('(mongo,getClient)', 'Init connections...');
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        logger.silly("(mongo,connect)", "connected to database: " + process.env.MONGODB_CNN);
    } catch (error) {
        logger.error('[Database, Connection]', 'Unable to Connect to DataBase');
        throw new Error('Error al inicializar la base de datos');
    }
}



module.exports = {
    connection
}