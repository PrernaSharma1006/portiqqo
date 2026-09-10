const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const getCallbackURL = () => {
  if (process.env.GOOGLE_CALLBACK_URL && process.env.GOOGLE_CALLBACK_URL.startsWith('https://')) {
    return process.env.GOOGLE_CALLBACK_URL;
  }
  if (process.env.RENDER || process.env.NODE_ENV === 'production') {
    return 'https://portiqqo.onrender.com/api/auth/google/callback';
  }
  return process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback';
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: getCallbackURL(),
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
          if (!email) {
            return done(new Error('No email found in Google profile'), null);
          }

          // Check if user already exists
          let user = await User.findOne({ email });

          if (user) {
            // User exists, update googleId and isEmailVerified if needed
            if (!user.googleId || !user.isEmailVerified) {
              await User.updateOne(
                { _id: user._id },
                { $set: { googleId: profile.id, isEmailVerified: true } }
              );
              user.googleId = profile.id;
              user.isEmailVerified = true;
            }
            return done(null, user);
          }

          // Extract name from profile
          const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User';
          const lastName = profile.name?.familyName || profile.displayName?.split(' ')[1] || '';

          // Create new user
          user = await User.create({
            email,
            googleId: profile.id,
            firstName,
            lastName,
            isEmailVerified: true,
            subscription: {
              type: 'trial',
              status: 'active',
              trialStartDate: new Date(),
              trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
          });

          return done(null, user);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn('⚠️ Google OAuth disabled: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set in environment.');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
