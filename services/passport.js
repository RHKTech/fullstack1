const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');  // use here to avoid multiple instances of user instantiation especially when running tests
const keys = require('../config/keys');


const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);   // mongo database id is user.id
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);   // mongo database user

  });
});



passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true

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
