const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/user");
const restaurantRoutes = require("./routes/restaurant");
const addressRoutes = require("./routes/address")
const commentRoutes = require("./routes/comment")
const gradeRoutes = require("./routes/grade")

const app = express();
const port = process.env.PORT || 3000;

//todo: controllers folder en vez de routes. Midlleware folder con common errors. + end a las calls. + status code especifico.

//middleware
app.use(express.json())
app.use("/api", userRoutes);
app.use("/api", restaurantRoutes);
app.use("/api", addressRoutes);
app.use("/api", commentRoutes);
app.use("/api", gradeRoutes);
app.use((error, req, res, next) => {
  console.error(error)
  console.log(error.name)
  if(error.name === 'CastError'){
    res.status(400).send({error:'id used is malformed'})
  }else {
    res.status(500).end()
  }
})

//routes
app.get("/", (req, res) => {
  res.send("Welcome to my Tattler API");
});

//mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));

app.listen(3000, () => console.log("server listening on port", port));

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})

