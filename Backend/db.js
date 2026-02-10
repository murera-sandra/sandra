const mongoose = require('mongoose'); // fix spelling
require('dotenv').config();

/*// Build the MongoDB URI from env variables
// Example: mongodb://username:password@host:port/database
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 5 // equivalent to your connectionlist
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;*/
export const  dbconnection = async()=>{
    try { 
    const connection = await mongoose.connect(process.env.MONGO_URI)
    console.log("connect to db")
    }catch(error){
        console.log("error have been found")
    }
};

module.export=dbConnection;

