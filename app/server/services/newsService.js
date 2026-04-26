const User = require('../models/User')
const Building = require('../models/Building')
const News = require('../models/News')
const Counter = require('../models/Counter')

const AppError = require('../errors/AppError')

exports.getAllNews = async () => {
    return await News.find()
}

exports.getNewsByBuildingId = async (building_id) => {
    return await News.find({ building_id: building_id })
}

exports.getNewsByAuthorId = async (author_id) => {
    return await News.find({ author_id: author_id })
}

newsNotFound = (news) => {
    if(!news){
        throw new AppError("News not found", 404)
    }
}

checkNews = (news) => {
    newsNotFound(news)
    return news
}

exports.getNewsById = (id) => {
    const news = await News.findOne({ id: id })
    return checkNews(news)
}

exports.createNews = (id, userId) => {
    const user = await User.findOne({ id: userId })
    if(!user){
        throw new AppError("User not found", 404)
    }

    if(!user.building_id){
        throw new AppError("User doesn't belong to any building", 401)
    }

    const counter = await Counter.findOneAndUpdate(
    { name: "newsLastId" },
    { $inc: { value: 1 } },
    { returnDocument: "after", upsert: true }
    )

    return await News.create({
        id: counter.value,
        building_id: user.building_id,
        author_id: user.id,
        title: data.title,
        content: data.content
    })
}

exports.deleteNews = (id) => {
    const news = await News.findOneAndDelete({ id: id })
    return checkNews(news)
}