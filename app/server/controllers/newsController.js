const newsService = require('../services/newsService')
const userService = require('../services/userService')

const AppError = require('../errors/AppError')

errorHandler = (err, res) => {
    if(err instanceof AppError){
        return res.status(err.status).json({ message: err.message })
    }
    console.error(err)
    res.status(500).json({ message: "Server Error" })
}

exports.getAllNews = async (req, res) => {
    const allNews = await newsService.getAllNews()
    res.json(allNews)
}

exports.getMyBuildingNews = async (req, res) => {
    const allNews = await newsService.getNewsByBuildingId(req.session.user.building_id)
    res.json(allNews)
}

exports.getMyNews = async (req, res) => {
    const allNews = await newsService.getNewsByAuthorId(req.session.user.id)
    res.json(allNews)
}

exports.getNewsById = async (req, res) => {
    try{
        const news = await newsService.getNewsById(req.params.id)
        res.json(news)

    } catch(err) {
        errorHandler(err, res)
    }
}

exports.createNews = async (req, res) => {
    try{
        const news = await newsService.createNews(req.body, req.session.user.id)
        res.status(200).json(news)
    
    } catch(err) {
        errorHandler(err, res)
    }
}

exports.deleteNews = async (req, res) => {
    try{
        const news = await newsService.deleteNews(req.params.id)
        res.json({ message: "News deleted" })

    } catch(err) {
        errorHandler(err, res)
    }
}