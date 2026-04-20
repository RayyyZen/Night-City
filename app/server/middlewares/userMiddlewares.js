exports.auth = (req, res, next) => {
    if(!req.session.user){
        return res.status(401).json({ message: "User not logged in" })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if(req.session.user.role !== "admin"){
        return res.status(403).json({ message: "Not authorized" })
    }
    next()
}

exports.isLogged = (req, res, next) => {
    if(req.session.user){
        return res.status(403).json({ message: "User already logged in" })
    }
    next()
}

exports.pendingUser = (req, res, next) => {
    if(!req.session.pendingUserId){
        return res.status(404).json({ message: "No pending user" })
    }
    next()
}