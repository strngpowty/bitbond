const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // creating reference with other table (User collection)
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status : {
        type : String,
        enum : {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`,
        }
    }
},
{
    timestamps: true
})

// compound index 
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself")
    }
    next()
})

const ConnectionRequestModal = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = ConnectionRequestModal