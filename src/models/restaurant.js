const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
  address:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'   
     }
  ],
  restaurant_id:String,
  name: String,
  contact: { phone: String, email: String, location: [Number] },
  starts: Number,
  categories: [String],
  grades:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grade'   
     }
  ],
  comments:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'   
     }
  ]
  
});

module.exports = mongoose.model("Restaurant", restaurantSchema);

