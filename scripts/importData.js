const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Restaurant = require("../src/models/restaurant");
const Address = require("../src/models/address");
const Comment = require("../src/models/comment");
const Grade = require("../src/models/grade");
const User = require("../src/models/user");
require("dotenv").config();

const importData = async () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("Connected to MongoDB Atlas"))
      .catch((error) => console.error(error));

      console.log("MONGODB_URI:", process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas");

    const restaurantsData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../scripts/data/restaurant.json"),
        "utf-8"
      )
    );
    const addressesData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../scripts/data/address.json"),
        "utf-8"
      )
    );
    const commentsData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../scripts/data/comment.json"),
        "utf-8"
      )
    );
    const gradesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../scripts/data/grade.json"), "utf-8")
    );
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../scripts/data/user.json"), "utf-8")
    );

    await Restaurant.deleteMany();
    await Address.deleteMany();
    await Comment.deleteMany();
    await Grade.deleteMany();
    await User.deleteMany();

    const insertedRestaurants = await Restaurant.insertMany(restaurantsData);
    const restaurantIdMap = insertedRestaurants.reduce((acc, restaurant) => {
      acc[restaurant.restaurant_id] = restaurant._id;
      return acc;
    }, {});

    addressesData.forEach((address) => {
      address.restaurant = restaurantIdMap[address.restaurant];
    });

    commentsData.forEach((comment) => {
      comment.restaurant = restaurantIdMap[comment.restaurant];
    });

    gradesData.forEach((grade) => {
      grade.restaurant = restaurantIdMap[grade.restaurant];
    });

    await Address.insertMany(addressesData);
    await Comment.insertMany(commentsData);
    await Grade.insertMany(gradesData);
    await User.insertMany(usersData);

    console.log("Data Imported Successfully");
    process.exit();
  } catch (error) {
    console.error("Error with data import", error);
    process.exit(1);
  }
};

importData();
