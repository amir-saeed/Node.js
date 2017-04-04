
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');
const ipware = require('ipware');

//router required for the application and for 2FA
const router = express.Router();


//************************************************************************
//************************************************************************
//********JWT AUTHENTICATION//********************************************
//************************************************************************
//direct dependencies: /server/passport/::/server/routes::/server/models**
//*************************************************************************

// connect to the database and load models
require('./server/models').connect(config.dbUri);

//instantiate express
const app = express();

// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
app.use('/', express.static(path.join(__dirname, 'static')));

// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authorization checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);



//****************************************************
//*****************************************************
//********2FA AUTHENTICATION**************************
//*****************************************************
//*****************************************************

const authy = require('authy')('your-auth-key');

router.get('/register', function(req, res) {
	console.log('New register request...');

	var isSuccessful = false;

	var email = req.param('email');
	var phone = req.param('phone');
	var countryCode = req.param('countryCode');
	
	authy.register_user(email, phone, countryCode, function (regErr, regRes) {
    	console.log('In Registration...');
    	if (regErr) {
       		console.log(regErr);
       		res.send('There was some error registering the user.');
    	} else if (regRes) {
    		console.log(regRes);
    		authy.request_sms(regRes.user.id, function (smsErr, smsRes) {
    			console.log('Requesting SMS...');
    			if (smsErr) {
    				console.log(smsErr);
    				res.send('There was some error sending OTP to cell phone.');
    			} else if (smsRes) {
    				console.log(smsRes);
    				res.send('OTP Sent to the cell phone.');
    			}
			});
    	}
   	});
});

router.get('/verify', function(req, res) {
	console.log('New verify request...');

	var id = req.param('id');
	var token = req.param('token');

	authy.verify(id, token, function (verifyErr, verifyRes) {
		console.log('Authorising...');
		res.send('Authorising...');	

		if (verifyErr) {
			console.log(verifyErr);
			res.send('OTP verification failed.');
		} else if (verifyRes) {
			console.log(verifyRes);
			res.send('Your detils have been verified.');	
		}
	});
});

app.use('/api', router);


//*******************************
//*******************************
//********Blacklisting//****
//*******************************
//*******************************
      
// Part1, defining blacklist
var BLACKLIST =['192.0.0.7']; //As example

// Part2, Geting client IP
var getClientIp = function(req) {
  var ipAddress = req.connection.remoteAddress;

if (!ipAddress) {
    return '';
  }

// convert from "::ffff:192.0.0.1"  to "192.0.0.1"
  if (ipAddress.substr(0, 7) == "::ffff:") {
    ipAddress = ipAddress.substr(7)
  }

return ipAddress;
};

//Part3, Blocking Client IP, if it is in the blacklist
app.use(function(req, res, next) {
  var ipAddress = getClientIp(req);

  if(BLACKLIST.indexOf(ipAddress) === -1){
    next();
  } else {
    res.send(ipAddress + ' IP is not in whiteList')
  }
});


// app.get('/', function (req, res) {
//     res.send('Hello World!')
// })

// app.post('/', function (req, res) {
//     res.send('Hello World!')
// })


//*******************************
//*******************************
//********Websocket//****
//*******************************
//*******************************
      
// const io = require('socket.io')(server);

// io.on('connection', function (socket) {
//   socket.emit('server event', { foo: 'bar' });
//   socket.on('client event', function (data) {
//     socket.broadcast.emit('update label', data);
//   });
// });

//********::socket.io connection::***********//




// start the server
app.listen(7001, () => {
  console.log('Server is running on http://localhost:7001 or http://127.0.0.1:7001');
});
