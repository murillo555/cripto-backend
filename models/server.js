const express = require('express');
const cors = require('cors');
const { connection } = require('../database/config');
const { logger } = require('../libs/logger');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/auth',
            users: '/users',
            roles: '/roles',
            currency: "/currency"
        }

        //Connect Data Base
        this.connectDB();
        //Middlewares
        this.middlewares();
        //Routes
        this.routes();
    }

    async connectDB() {
        await connection();
    }

    middlewares() {
        //Cors
        this.app.use(cors());
        //Read 
        this.app.use(express.json());
        //Views
        this.app.use(express.static('views'));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/authRoutes'))
        this.app.use(this.paths.users, require('../routes/usersRoutes'))
        this.app.use(this.paths.roles, require('../routes/rolesRoutes'))
        this.app.use(this.paths.currency, require('../routes/criptoRoutes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            logger.info('Listen at :', this.port);
        });
    }

}

module.exports = Server;