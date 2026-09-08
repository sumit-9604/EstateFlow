const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Agent', 'Manager'], default: 'Agent' } // [cite: 58, 60]
});
module.exports = mongoose.model('User', UserSchema);