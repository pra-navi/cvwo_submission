import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    creator: {
        type: String
    },
    tags: {
        type: [String],
        required: true
    }, //array of strings
    selectedFile: String,
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    },
    comments: [
        {
            message: String,
            rating: Number,
            name: String,
        },
    ],
    createdAt: {
        type: Date, //type is date
        default: new Date() //default is current date
    },
});

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;