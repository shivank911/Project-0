let app=require('./app');
let dotenv=require("dotenv");
const dataBaseConnect=require("./Config/database");


//Handling uncaught Exception
process.on("uncaughtException",(err) => {
    console.log(`Error:${err.message}`);
    console.log("shutting down server due to uncaught ecxeption");
    server.close(() => {
        process.exit(1);
    })
})

//config dotenv
dotenv.config({path:"Backend/Config/config.env"})


//connect to database
dataBaseConnect();


//server at port 
const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running at port:${process.env.PORT}`);
})


//unhandeled promise Rejection
process.on("unhandledRejection",(err) => {
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to unhandled promise Rejection`);
    server.close( () => {
        process.exit(1);
    })
})