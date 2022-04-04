const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config({path:"Backend/Config/config.env"});
let db_link=process.env.db_link;



const dataBaseConnect=()=>{
    mongoose.connect(db_link)
.then((data)=>{
    console.log("connection to db successful");
})
}

module.exports=dataBaseConnect;