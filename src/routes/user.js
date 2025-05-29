const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModal = require('../models/connectionRequest');
const userRouter = express.Router()
const User = require("../models/user")
const USER_SAFE_DATA = ["firstName", "lastName", "photoURL", "skills", "age", "gender", "about"]

// get all the pending request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequestModal.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId", USER_SAFE_DATA)

        return res.status(200).json({
            message : "data collected", 
            data : connectionRequests})
    } catch(err) {
        res.status(404).send("Error :" + err.message);
    }
})

// get my connections
userRouter.get("/user/connections", userAuth, async (req, res) =>{
    try {
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequestModal.find({
            $or: [
                { toUserId: loggedInUser._id, status : "accepted"},
                { fromUserId : loggedInUser._id, status : "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
          .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({data})
    } catch (err) {
        res.status(400).send("Error :: "+err)
    }
})

// feed api
userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) ||10
        limit = limit > 50 ? 50 : limit
        const skip = (page -1) * limit
        // find all the connection requests loggedInUser has send/ received
        const connectionRequests = await ConnectionRequestModal.find({
            $or : [
                { fromUserId: loggedInUser._id },
                { toUserId : loggedInUser._id }
            ]
        }).select("fromUserId toUserId")
        const hideUsersInFeed = new Set()
        connectionRequests.forEach( req => {
            hideUsersInFeed.add(req.fromUserId.toString())
            hideUsersInFeed.add(req.toUserId.toString())
        })
        const showUsersInFeed = await User.find({
            $and: [
                {_id : { $nin : Array.from(hideUsersInFeed)}},
                {_id : { $ne : loggedInUser._id}},
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.send(showUsersInFeed)
    } catch (err) {
        res.status(400).send("Error :: "+err)
    }
})

module.exports = userRouter;