const { Schema, mongoose } = require('mongoose')

const userSchema = new Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    email: { type: String, required: true},
    profile_img: { type: String},
    created_at: { type: Date, required: true}
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel