const express = require("express");
const mongoose = require("mongoose");
const Grade = require("../models/grade");
const Restaurant = require("../models/restaurant");

const router = express.Router();

// Crear score
router.post("/grades", async (req, res) => {
    try {
        const { date, score, restaurantId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const newGrade = new Grade({
            date: date || Date.now(), // Usar la fecha proporcionada o la fecha actual
            score,
            restaurantId: restaurant._id,
        });

        const savedgrade = await newGrade.save();
        
        restaurant.grades = restaurant.grades.concat(savedgrade._id);
        await restaurant.save();

        res.status(201).json(savedgrade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Obtener todos los scores
router.get("/grades", (req, res) => {
    Grade.find()
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

// Obtener un score
router.get("/grades/:id", (req, res) => {
    const { id } = req.params;
    Grade.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

// Actualizar un score
router.put("/grades/:id", (req, res) => {
    const { id } = req.params;
    const { date, score } = req.body;
    Grade.updateOne({ _id: id }, { $set: { date, score } })
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

// Eliminar un score
router.delete("/grades/:id", (req, res) => {
    const { id } = req.params;
    Grade.deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports = router;