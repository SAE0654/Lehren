import * as dynamoose from "dynamoose";
const bcrypt = require('bcryptjs');

const SchemaUser = new dynamoose.Schema({
    "email": String,
    "password": String,
    "rol": String,
    "names": String
});

const User = dynamoose.model("Productos_Usuarios", SchemaUser);

export default User;

// import { Schema, model, models } from 'mongoose';
// const bcrypt = require('bcryptjs');



// const userSchema = new Schema({
//     email: { type: String, required: true },
//     names: { type: String, required: true},
//     password: { type: String, required: true },
//     rol: { type: String, required: true }
// });


// const User = models.User || model('User', userSchema);

// export default User;
