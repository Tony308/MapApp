const monk = require('monk')(`${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`)

module.exports = monk;