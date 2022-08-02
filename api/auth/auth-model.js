const db = require('../../data/dbConfig');

module.exports = {
    findBy,
    create
}

function findBy(filter) {
    if(filter)
        return db('users')
            .where(filter)
            .first();
    else 
        return db('users');
}

async function create(user) {
    let [id] = await db('users')
        .insert(user);
    return findBy({id});
}