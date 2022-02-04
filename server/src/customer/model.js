const { Schema, model } = require("mongoose");

const schema = new Schema({
  customerTag: String,

  // keep track of how many shipments & packing slips have been created
  numShipments: {
    type: Number,
    default: 1
  },

  numPackingSlips: {
    type: Number,
    default: 1
  },
});

const Model = model('customer', schema);
module.exports = Model;