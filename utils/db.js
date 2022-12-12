import * as dynamoose from "dynamoose";
import AWS from "aws-sdk";

const params = {
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    "region": "us-east-1"
}
const ddb = new dynamoose.aws.ddb.DynamoDB(params);

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

// For Update operations we use AWS CLIENT porque no jala con el otro xd:
const db = new AWS.DynamoDB.DocumentClient();

export default db;

