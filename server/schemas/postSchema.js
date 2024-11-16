const { Schema, mongoose } = require('mongoose');

const postSchema = new Schema({
    _id : { type: String, required: true },
    user_id: { type: String, required: true },
    post_img: { type: String, required: true},
    likes: { type: Array },
    comments: { type: Array }
});

const postModel = mongoose.model('posts', postSchema);

module.exports = postModel;
