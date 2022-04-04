const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

const ErrorMiddleware=require("./Middleware/error.js");

const product=require("./Routes/productRoute");
const user = require("./Routes/userRoute");
const order = require("./Routes/orderRoute");
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);



//Middleware for error
app.use(ErrorMiddleware);


module.exports=app;