
if(process.env.NODE_ENV != "production"){
    require("dotenv").config()

}


const mongoose = require("mongoose")
async function connectToDB(){
    try{
        CONNSTRING = process.env.DB_URL
        await mongoose.connect(CONNSTRING)
        console.log("connected to db")
    }catch(error){

    }
}

module.exports = connectToDB