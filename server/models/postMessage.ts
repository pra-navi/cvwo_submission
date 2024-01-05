import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
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
    },
    timeTaken: { type: Number, default: 0 },
    selectedFile: String,
    listIds: {
        type: [String],
        default: []
    },
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
    averageRating: { type: Number, default: 0},
    createdAt: {
        type: Date,
        default: new Date() //default is current date
    },
});

const PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;