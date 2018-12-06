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

// @route POST /api/user/login
// @desc Login a user
// @access Public
router.post('/login', (req, res) => {
    const errors = {};

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
    .then(user => {
        // If no user found, invalid credentials
        if(!user) {
            errors.login = 'Invalid credentials, please try again';
            return res.status(404).json(errors);
        }
        // If the user is found, check to see if the password is correct
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            // If credentials are correct, generate token
            if(isMatch) {
                const payload = { id: user.id, name: user.name };

                // Sign the token - add playload and secret key
                // Add the token expiration time
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 7200 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                )
            }
            // not a match, invalid credentials
            else {
                errors.login = 'Invalid credentials, please try again';
                return res.status(404).json(errors);
            }
        });
    })
});

// @route  GET /api/users/current
// @desc   Return current user 
// @access Private (Need to send a token to access this private route)
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // If passport successfully gets the user, it can be accessed
    // via req.user
    // Send up the user data
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});


// export the router
module.exports = router;