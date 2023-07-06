import mongoose from 'mongoose';

const listSchema = mongoose.Schema({
    listName: { type: String, required: true },
    ownerId: { type: String, required: true },
    totalTime: { type: Number, default: 0 },
    learningList: {
        type: [String],
        default: []
    }, 
    doneList: {
        type: [String],
        default: []
    }, 
    isPrivate: { type: Boolean, default: false }
});

export default mongoose.model("List", listSchema);