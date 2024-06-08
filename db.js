const mongoose = require('mongoose');
const mongoogeUri = "mongodb://127.0.0.1:27017/inotebook";

const connectToMongo = async()=>{
   try {
      await mongoose.connect(mongoogeUri);
      console.log("mongoose db connection successfully");
   } catch (error) {
      console.error("Failes to connect mongoosedb",error);
   }
}

module.exports = connectToMongo;