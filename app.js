const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const session = require('express-session');
const app = express();

require('dotenv').config();
// middleware
app.use(cors());
app.use(bodyParser.json() || express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger('dev'));
app.use(compression({
    level: 9
}, ));
app.use(helmet());
app.use(session({
    secret: 'string_secret_key' || process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000,
        httpOnly: true,
        sameSite: true,
        secure: false,
        signed: false,
    }
}));

//  static files
app.use(express.static(`${__dirname}/public`));

// Conten-Type application/json
app.use((req, res, next) => {
    res.set('Content-Type', 'application/json');
    next();
});

// req set header
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST,PUT, PATCH, DELETE, OPTIONS');
    next();
});



// connect firebase
const {
    realtimeDB
} = require('./src/config/firebaseConfig');

app.post('/', async (req, res) => {
    const {
        title,
        description
    } = req.body;
    const test = {
        title: title,
        description: description,
        createdAt: new Date().toLocaleDateString()
    };
    await realtimeDB.ref('test').push(test).then(() => {
        console.log('success');
        res.status(200).json({
            message: 'success'
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            message: 'err pushing'
        })
    });
});
app.get('/', (req, res) => {
    realtimeDB.ref('test').once('value', snapshot => {
        snapshot.val();
    }).then(result => {
        res.status(200).json({
            message: 'fetched',
            result
        })
    }).catch(er => res.status(500).json({
        message: 'something wrong '
    }))
});

module.exports = app;