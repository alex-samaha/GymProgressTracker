const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    workoutType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

// export the workout schema
module.exports = Workout = mongoose.model('workouts', WorkoutSchema);
