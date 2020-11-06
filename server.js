const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const login = require('./controllers/logIn');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const server = express();

server.use(express.json());
server.use(cors());
server.use(morgan('combined'));
//console.log('Test');

const database = knex({
    client: 'pg',
    // Local
    // connection: {
    //     host: process.env.POSTGRES_HOST,
    //     database: process.env.POSTGRES_DB,
    //     user: process.env.POSTGRES_USER,
    //     password: process.env.POSTGRES_PASSWORD
    // }
    // Heroku
    // connection: {
    //     connectionString: process.env.DATABASE_URL,
    //     ssl: {rejectUnauthorized: false}
    // }
    // Docker
    connection: process.env.POSTGRES_URI
});

server.get('/', (req, res) => res.send('Sb'));
server.post('/login', login.handleLogIn(database, bcrypt));
server.post('/register', register.handleRegister(database, bcrypt));
server.get('/profile/:id', profile.handleProfileGet(database));
server.post('/apicall', (req, res) => image.handleAPICall(req, res));
server.put('/image', image.handleImage(database));

server.listen(
    process.env.PORT || 3001,
    () => console.log(`Server listening on port: ${process.env.PORT || 3001}`)
);