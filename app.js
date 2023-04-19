const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

const routers = require('./routers');

dotenv.load({path: '.env'});

/**
 * Create Express server.
 */
const app = express();
app.set('port', process.env.PORT || 4000);
app.set('trust proxy', true);
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 5000}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(cors());

app.use(require("./routers"));

/**
 * Start Express server.
 */
app.listen(app.get('port'), function () {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
module.exports = app;
