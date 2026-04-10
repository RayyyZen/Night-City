const User = require('../models/User')
const Counter = require('../models/Counter')

exports.getAllUsers = async () => {
    return await User.find()
    // User.find().select('-mdp')
}

exports.getUserById = async (id) => {
    return await User.findOne({ id: id })
}

exports.createUser = async (data) => {
    const counter = await Counter.findOneAndUpdate(
    { name: "userId" },
    { $inc: { value: 1 } },
    { returnDocument: "after", upsert: true }
    )

    return await User.create({
        id: counter.value,
        ...data
        // To access to what the data variable contains
    })
}

exports.updateUser = async (id, data) => {
    return await User.findOneAndUpdate({ id: id }, data, { returnDocument: "after" })
    // To return the user after the update
}

exports.deleteUserById = async (id) => {
    return await User.findOneAndDelete({ id: id })
}