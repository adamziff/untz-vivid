import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function dbConnect() {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    //   bufferMaxEntries: 0,
    //   useFindAndModify: false,
    //   useCreateIndex: true,
    };

    if (!MONGODB_URI) {
        throw new Error(
          'Please define the MONGODB_URI environment variable inside .env.local'
        );
      }

    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully');
  } catch (error : any) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

export default dbConnect;
