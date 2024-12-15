const mongo = require('mongoose');

const Schema = mongo.Schema;

const Pays = new Schema({
    name: String,
    capitale:String,
    code: String
});

module.exports = mongo.model('paysCol', Pays, 'paysCollection');