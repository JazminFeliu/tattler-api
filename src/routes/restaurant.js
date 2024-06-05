const express = require("express");
const restaurantSchema = require("../models/restaurant");

const router = express.Router();

//create restaurant
router.post("/restaurants", (req, res) => {
  const restaurant = restaurantSchema(req.body);
  restaurant
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//get all restaurants
router.get("/restaurants", (req, res) => {
  restaurantSchema
    .find()
    .populate("address", {building:1, coord:1, street:1, zipcode: 1, _id:0})
    .populate("comments", {date:1, comment:1})
    .populate("grades", { date: 1, score: 1, _id: 0 })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//get a restaurants
router.get("/restaurants/:id", (req, res) => {
  const { id } = req.params;
  restaurantSchema
    .findById(id)
    .populate("address", {building:1, coord:1, street:1, zipcode: 1, _id:0})
    .populate("comments", {date:1, comment:1})
    .populate("grades", { date: 1, score: 1, _id: 0 })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//update a restaurants
router.put("/restaurants/:id", (req, res) => {
  const { id } = req.params;
  const {
    restaurant_id,
    address,
    name,
    contact,
    phone,
    email,
    location,
    starts,
    categories,
  } = req.body;
  restaurantSchema
    .updateOne(
      { _id: id },
      {
        $set: {
          restaurant_id,
          name,
          contact,
          phone,
          email,
          location,
          starts,
          categories,
        },
      }
    )
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

//delete a restaurants
router.delete("/restaurants/:id", (req, res) => {
  const { id } = req.params;
  restaurantSchema
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});


//pipeline para obtener los 5 restaurantes con calificacion mas alta
router.get("/aggregated-restaurants", (req, res) => {
  const pipeline = [
      {
          $lookup: {
              from: 'grades',
              localField: 'grades',
              foreignField: '_id',
              as: 'grades'
          }
      },
      {
          $addFields: {
              averageGrade: { $avg: '$grades.score' }
          }
      },
      {
          $sort: { averageGrade: -1 }
      },
      {
          $limit: 5
      },
      {
          $project: {
              name: 1,
              averageGrade: 1
          }
      }
  ];

  restaurantSchema.aggregate(pipeline)
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json({ message: error.message }));
});



//pipeline para obtener todos los restaurantes con sus comentarios y calificaciones
router.get("/details-restaurants", (req, res) => {
  const pipeline = [
    {
        $lookup: {
            from: 'comments',
            localField: 'comments',
            foreignField: '_id',
            as: 'comments'
        }
    },
    {
        $lookup: {
            from: 'grades',
            localField: 'grades',
            foreignField: '_id',
            as: 'grades'
        }
    }
];

restaurantSchema.aggregate(pipeline)
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json({ message: error.message }));
});

//pipeline para obtener cantidad de comentarios y calificaciones promedio
router.get("/comments-average-restaurants", (req, res) => {
  const pipeline = [
    {
        $lookup: {
            from: 'comments',
            localField: 'comments',
            foreignField: '_id',
            as: 'comments'
        }
    },
    {
        $lookup: {
            from: 'grades',
            localField: 'grades',
            foreignField: '_id',
            as: 'grades'
        }
    },
    {
        $addFields: {
            numberOfComments: { $size: '$comments' },
            averageGrade: { $avg: '$grades.score' }
        }
    },
    {
        $project: {
            name: 1,
            numberOfComments: 1,
            averageGrade: 1
        }
    }
];

restaurantSchema.aggregate(pipeline)
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports = router;