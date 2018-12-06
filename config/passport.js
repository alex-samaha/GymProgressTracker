// import modules and declare passport strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

// import the users model by passing the schema name
const User = mongoose.model('users');
const keys = require('./keys');

// Setup jwt options
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

// create the actual strategy to export
// passport is taken in as a parameter
module.exports = passport => {
    // the jwt payload is the payload object that gets created when
    // the user successfully logs in
    // this strategy is used from the routes
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
        .then(user => {
            if(user) {
                // done function takes two parameters:
                // error if there is one (null in this case)
                // and the user
                return done(null, user);
            }
            // No error still, but return false because
            // no user was found
            return done(null, false);
        })
        .catch(err => console.log(err));
    }));
}