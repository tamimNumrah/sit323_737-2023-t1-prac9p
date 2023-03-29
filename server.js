const express= require("express");
const res = require("express/lib/response");
const app= express();
const fs = require('fs');
const winston = require('winston');

const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const LocalStrategy = require('passport-local').Strategy;

//Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculate-microservice' },
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  });
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }
//configure express session
app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
  }));

//configure middleware 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

//Passport Login Strategy
passport.use(new LocalStrategy(
    // function of username, password, done(callback)
    function(username, password, done) {
      // look for the user data
      if (username === "user" && password === "SIT737") {
        logger.info('Login successfull');
        return done(null, { username: "user"});
      } else {
        logger.info('Login failed');
        return done(null, false, { message: 'Invalid Info.' });
      }
    }
));

//Serializing user
passport.serializeUser(function (user, done) {
    done(null, user.username);
});
  
passport.deserializeUser(function (username, done) {
    done(null, { username: username });
});

//Define GET routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  })

//Route to Login Page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

//Route to Dashboard
app.get('/dashboard', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.username}. Your session ID is ${req.sessionID} 
     and your session expires in ${req.session.cookie.maxAge} 
     milliseconds.<br>
     You can use addition, subtraction, multiplication, division APIs now.
     <br>
     <a href="/logout">Log Out</a><br><br>`);
  });

// Route to Log out
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });
// Post Route: /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),  function(req, res) {
	console.log(req.user)
	res.redirect('/dashboard');
});




const add= (num1,num2) => {
    return num1+num2;
}
const sub= (num1,num2) => {
    return num1-num2;
}
const mul= (num1,num2) => {
    return num1*num2;
}
const div= (num1,num2) => {
    return num1/num2;
}
app.get("/add", isLoggedIn, (req,res)=>{
    try{
    const num1= parseFloat(req.query.num1);
    const num2=parseFloat(req.query.num2);
    checkParameterIntegrity(num1, num2);
    logger.info('Parameters '+num1+' and '+num2+' received for addition');
    const result = add(num1,num2);
    res.status(200).json({statuscocde:200, data: result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
});
app.get("/sub", isLoggedIn, (req,res)=>{
    try{
    const num1= parseFloat(req.query.num1);
    const num2=parseFloat(req.query.num2);
    checkParameterIntegrity(num1, num2);
    logger.info('Parameters '+num1+' and '+num2+' received for subtraction');
    const result = sub(num1,num2);
    res.status(200).json({statuscocde:200, data: result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
});
app.get("/mul", isLoggedIn, (req,res)=>{
    try{
    const num1= parseFloat(req.query.num1);
    const num2=parseFloat(req.query.num2);
    checkParameterIntegrity(num1, num2);
    logger.info('Parameters '+num1+' and '+num2+' received for multiplication');
    const result = mul(num1,num2);
    res.status(200).json({statuscocde:200, data: result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
});
app.get("/div", isLoggedIn, (req,res)=>{
    try{
    const num1= parseFloat(req.query.num1);
    const num2=parseFloat(req.query.num2);
    checkParameterIntegrity(num1, num2);
    if (num2 == 0) {
        logger.error("num2 is incorrectly defined. Cannot divide by 0");
        throw new Error("num2 incorrectly defined. Cannot divide by 0");
    }
    logger.info('Parameters '+num1+' and '+num2+' received for division');
    const result = div(num1,num2);
    res.status(200).json({statuscocde:200, data: result }); 
    } catch(error) { 
        console.error(error)
        res.status(500).json({statuscocde:500, msg: error.toString() })
      }
});

const checkParameterIntegrity = (num1, num2) => {
    if(isNaN(num1)) {
        logger.error("num1 is incorrectly defined");
        throw new Error("num1 incorrectly defined");
    }
    if(isNaN(num2)) {
        logger.error("num2 is incorrectly defined");
        throw new Error("num2 incorrectly defined");
    }
    
    if (num1 === NaN || num2 === NaN) {
        console.log()
        throw new Error("Parsing Error");
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

const port=8080;
app.listen(port,()=> {
    console.log("hello i'm listening to port " +port);
})