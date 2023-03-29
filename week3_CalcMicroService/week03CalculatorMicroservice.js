const express= require("express");
const res = require("express/lib/response");
const app= express();
const fs = require('fs');
const winston = require('winston');

//Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculate-microservice' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  });
  
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }


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
app.get("/add", (req,res)=>{
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
app.get("/sub", (req,res)=>{
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
app.get("/mul", (req,res)=>{
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
app.get("/div", (req,res)=>{
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



const port=8080;
app.listen(port,()=> {
    console.log("hello i'm listening to port " +port);
})