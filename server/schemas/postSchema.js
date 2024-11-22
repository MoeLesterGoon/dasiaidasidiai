const { Schema, mongoose } = require('mongoose');

const postSchema = new Schema({
    username: { type: String, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postImg: { type: String, required: true},
    likes: { type: Array, default: 0},
    comments: { type: Array, ref: "Comments"},
    title: {type: String},
    description: {type: String}
});

const postModel = mongoose.model('Posts', postSchema);

module.exports = postModel;
