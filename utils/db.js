import mongoose from 'mongoose';

const connectMongo = async () => mongoose.connect(process.env.DEV_MONGO_URI);

export default connectMongo;
