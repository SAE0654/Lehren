import * as dynamoose from "dynamoose";

// Create new DynamoDB instance
const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    "region": "us-east-1"
});

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

// import mongoose from 'mongoose';

// const connectMongo = async () => mongoose.connect(process.env.MONGO_URI);

// export default connectMongo;
