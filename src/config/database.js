const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://strngpowty:Zsmy0odwIQlJl8Ne@devgramcluster.wgc4y.mongodb.net/bitBond"
    )
}

module.exports =  connectDB;
