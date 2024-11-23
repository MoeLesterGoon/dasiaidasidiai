const { Schema, mongoose } = require('mongoose');

const postSchema = new Schema({
    username: { type: String, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts", required: true },
    content: { type: String, required: true},
    likes: { type: Array, default: 0},
    replies: { type: Array, unique: true},
});

const postModel = mongoose.model('Comments', postSchema);

module.exports = postModel;
