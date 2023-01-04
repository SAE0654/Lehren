import * as dynamoose from "dynamoose";

const SchemaUser = new dynamoose.Schema({
    "id": String,
    "email": String,
    "password": String,
    "rol": String,
    "names": String
});

const User = dynamoose.model("P1_Usuarios", SchemaUser);

export default User;
