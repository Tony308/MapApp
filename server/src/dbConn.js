const monk = require('monk');

const db = monk(process.env.DB_URL);

module.exports = db;
