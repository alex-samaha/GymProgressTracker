// import modules
const express = require('express');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const router = express.Router();

// @route POST /api/user/register
// @desc Register a user
// @access Public
router.post('/register', (req, res) => {
    const errors = {};
    // Check if the email exists in the database
    User.findOne({email: req.body.email})
        .then(user => {
            // If the user exists, throw a 400 error with message
            if(user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            }
            else {
                // Create the new user
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                // hash user's password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
});

// export the router
module.exports = router;