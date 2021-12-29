const { Schema, model } = require("mongoose");

const schema = new Schema({
  customerTag: String
});

const Model = model('customer', schema);
module.exports = Model;