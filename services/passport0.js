const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');  // use here to avoid multiple instances of user instantiation especially when running tests
const keys = require('../config/keys');


const User = mongoose.model('users');

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {

      User.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            // we already have a user record with this ID
            done(null, existingUser);
          } else {
            // we don't have a user record with this ID, make a new record
            new User({ googleId: profile.id })
              .save()
              .then(user => done(null, user));

          }
        });

//      console.log('access token', accessToken);
//      console.log('refresh token', refreshToken);
//      console.log('profile', profile);
    }
  )
);
