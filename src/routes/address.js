const express = require("express");
const mongoose = require("mongoose");
const Address = require("../models/address");
const Restaurant = require("../models/restaurant");

const router = express.Router();

// Crear comentario
router.post("/address", async (req, res) => {
  try {
    const { building, coord, street, zipcode, restaurantId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const newAddress = new Address({
      building,
      coord,
      street,
      zipcode,
      restaurantId: restaurant._id,
    });

    const savedAddress = await newAddress.save();
    restaurant.address = restaurant.address.concat(savedAddress._id);
    await restaurant.save();

    res.status(201).json(savedAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Obtener todas las address
router.get("/address", (req, res) => {
  Address.find()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Obtener un address
router.get("/address/:id", (req, res) => {
  const { id } = req.params;
  Address.findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Actualizar un address
router.put("/address/:id", (req, res) => {
  const { id } = req.params;
  const { date, comment } = req.body;
  Address.updateOne({ _id: id }, { $set: { building, coord, street, zipcode } })
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Eliminar un address
router.delete("/address/:id", (req, res) => {
  const { id } = req.params;
  Address.deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports = router;
