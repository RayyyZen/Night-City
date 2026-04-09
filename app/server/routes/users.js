const express = require('express')
const router = express.Router()

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

router.get('/', (req, res) => {
    res.json(users)
})

router.get('/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id)
    if(!user){
        return res.status(404).send("User not found")
    }
    return res.json(user)
})

router.post('/', (req, res) => {
    const newUser = { id: (users.length + 1), name: req.body.name}
    users.push(newUser)
    res.status(201).json(newUser)
})

router.delete('/:id', (req, res) => {
    users = users.filter(u => u != req.params.id)
    return res.send("User deleted")
})

module.exports = router