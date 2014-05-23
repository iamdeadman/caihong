var fs = require('fs')
    , path = require('path')
    , Sequelize = require('sequelize')
    , lodash = require('lodash')
    , db = {};

console.log("in models\\index")
var Sequelize = require('sequelize')
    , sequelize = null

if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    console.log("remote");
    var match = process.env.HEROKU_POSTGRESQL_BRONZE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

    sequelize = new Sequelize(match[5], match[1], match[2], {
        dialect: 'postgres',
        protocol: 'postgres',
        port: match[4],
        host: match[3],
        logging: true //false
    })
} else {
    console.log("local");
    // the application is executed on the local machine
    sequelize = new Sequelize('air', 'postgres', 'i298jf29NNDJJWJJJEWU922992384u982j23f9iejf',
        {dialect: 'postgres'})
    console.log("done seq");
}
console.log("done local");

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    })

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db)
    }
})

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db)