const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
      const conn=await mongoose.connect(process.env.MongoURL);
      console.log(`MongoDB connected ${conn.connection.host}`)
    }
    catch(err){
        console.log(`MongoDB connection ${err}`);
        process.exit(1)
    }
}
module.exports=connectDB