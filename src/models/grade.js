const mongoose = require("mongoose");

const gradeSchema = mongoose.Schema({
    date: {type: Date, default: Date.now},
    score: Number,
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    }
});


module.exports = mongoose.model("Grade", gradeSchema)