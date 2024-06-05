const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    date: {type: Date, default: Date.now},
    comment: String,
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    }
});


module.exports = mongoose.model("Comment", commentSchema)