import { Schema, model, models } from 'mongoose';
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    email: { type: String, required: true },
    names: { type: String, required: true},
    password: { type: String, required: true },
    rol: { type: String, required: true }
});

userSchema.methods.encryptPassword = async (password) => {
    const encrypted = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = bcrypt.hash(password, encrypted);
    return hash;
}

userSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

const User = models.User || model('User', userSchema);

export default User;
