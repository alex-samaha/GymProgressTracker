// import modules
const express = require('express');
const Workout = require('../../models/Workout');
const passport = require('passport');

const router = express.Router();

// @route  GET /api/workouts
// @desc   Get's all the user's workouts
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    // Find all of the workouts for the user
    // Sort them based on the date - newest ones first
    Workout.find({ user: req.user.id })
    .sort({date: -1})
    .then(workouts => res.json(workouts))
    .catch(err => res.status(404).json({noWorkoutsFound: 'No workouts found for the user'}))
});

// @route  POST /api/workouts
// @desc   Create a workout
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};

    const newWorkout = new Workout({
        user: req.user.id,
        name: req.body.name,
        workoutType: req.body.workoutType,
        description: req.body.description
    });

    // Save the new workout and send it up
    newWorkout.save()
    .then(workout => res.json(workout));
});

module.exports = router;
