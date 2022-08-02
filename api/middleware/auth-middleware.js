const authMod = require('../auth/auth-model')

module.exports = {
    uniqueUsername,
    shape
};

async function uniqueUsername(req, res, next) {
    const { username } = req.user;
    let result = await authMod.findBy({username});
    if(result) return res.status(404).json({message: 'username taken'})
    next()
}

function shape(req, res, next) {
    const {username, password} = req.body;
    if(!username || username.trim() === '' || !password || password.trim() === '') return res.status(404).json({message: "username and password required"})
    req.user = {
        username: username.trim(),
        password: typeof password === 'number' ? password : password.trim()
    }
    next()
}