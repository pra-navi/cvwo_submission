import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String, //userName
    creator: String,
    tags: [String], //array of strings
    selectedFile: String,
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    },
    comments: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date, //type is date
        default: new Date() //default is current date
    },
});

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;