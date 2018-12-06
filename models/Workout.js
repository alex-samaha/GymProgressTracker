const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
    // Associate the workout with a user
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
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
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// export the workout schema
module.exports = Workout = mongoose.model('workouts', WorkoutSchema);
