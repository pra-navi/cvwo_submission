import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    id: { type: String }, // not sure what this is use for
    myLists: {
        type: [ 
            {
                listId: String, 
                listName: String
            }, 
        ], 
        default: []
    }, 
    listsArePrivate: { type: Boolean, default: false }, 
    postCreated: { type: Number, default: 0 }
});

export default mongoose.model("User", userSchema);