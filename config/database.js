const { error } = require("console");
const mongoose = require("mongoose");
require("dotenv").config();
// connection with db
exports.dbConnect = ()=>{
    
        mongoose.connect(process.env.DATABASE_URL)
        .then(()=>{console.log("DATABASE CONNECTION SUCCESS");
        })
        .catch((error)=>{
            console.log("DB connection error");
            console.error(error);
            process.exit(1);
        })
};