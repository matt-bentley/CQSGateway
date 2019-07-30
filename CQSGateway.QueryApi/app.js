const express = require('express');
const app = express();
const api = require('./api');
const registerODataRoutes = require('./api/routes/odata');
const morgan = require('morgan'); // logger
const bodyParser = require('body-parser');
const auth = require('./auth/middleware');
const bearerToken = require('express-bearer-token');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//app.use(bearerToken());
//app.use(auth);

app.use('/api',api);
registerODataRoutes(app);

app.use(express.static('static'));

app.use(morgan('dev'));

app.use(function(req,res){
	const err = new Error('Not Found');
	err.status = 404;
	res.json(err);
});

//  MongoDB connection 
const mongoose = require('mongoose');
const mongoHost = process.env.MONGO_HOST || 'localhost';

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('Connected to MongoDB at ' + mongoHost);

	app.listen(app.get('port'), function () {
		console.log('API Server Listening on port ' + app.get('port'));
	});
});

mongoose.connect(`mongodb://${mongoHost}:27017/dev`, {
	'auth': { 'authSource': 'admin' },
	'user': 'admin',
	'pass': 'password',
	useNewUrlParser: true,
	autoReconnect: true,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 500
});