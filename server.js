// import modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// import routes
const users = require('./routes/api/users');

const app = express();

// Body parser configuration
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database config
const db = require('./config/keys').mongoURI;

// Connect to database
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log("Database connection established"))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/api/users', users);

// Set the port
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
