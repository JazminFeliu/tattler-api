const mongoose = require("mongoose");

const addressSchemma = mongoose.Schema({
  building: String,
  coord: [Number],
  street: String,
  zipcode: String,
  restaurant:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
}
});

module.exports = mongoose.model("Address", addressSchemma);
