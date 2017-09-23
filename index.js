const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');

require('./models/User');      // must define function before using it
require('./services/passport');


mongoose.connect(keys.mongoURI);

const app = express();

//  app.use() functions are middleware functions that handle incoming and outgoing
//  requests to put them into a format understandable by the programs main components,
//  first the route handlers, then internal user objects, etc.

app.use(
  cookieSession({
    maxAge: 30*24*60*60*1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);




const PORT = process.env.PORT || 5000;

app.listen(PORT);
