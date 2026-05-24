const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(
  new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback',  // absolute URL
},
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this googleId
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // Check if email already registered locally
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          // Link Google to existing account
          user.googleId = profile.id;
          user.authProvider = 'google';
          user.avatar = profile.photos[0]?.value || null;
          await user.save();
          return done(null, user);
        }

        // Brand new user — create them
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0]?.value || null,
          authProvider: 'google',
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;