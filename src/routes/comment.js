const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Restaurant = require("../models/restaurant");

const router = express.Router();

// Crear comentario
router.post("/comments", async (req, res) => {
    try {
        const { date, comment, restaurantId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: "Invalid restaurant ID" });
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const newComment = new Comment({
            date: date || Date.now(), // Usar la fecha proporcionada o la fecha actual
            comment,
            restaurantId: restaurant._id,
        });

        const savedComment = await newComment.save();
        
        restaurant.comments = restaurant.comments.concat(savedComment._id);
        await restaurant.save();

        res.status(201).json(savedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Obtener todos los comentarios
router.get("/comments", (req, res) => {
    Comment.find()
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

// Obtener un comentario
router.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    Comment.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

// Actualizar un comentario
router.put("/comments/:id", (req, res) => {
    const { id } = req.params;
    const { date, comment } = req.body;
    Comment.updateOne({ _id: id }, { $set: { date, comment } })
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

// Eliminar un comentario
router.delete("/comments/:id", (req, res) => {
    const { id } = req.params;
    Comment.deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports = router;