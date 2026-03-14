const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();
        const approvedAdmins = (process.env.APPROVED_ADMIN_EMAILS || '')
          .split(',')
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);

        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          user.lastLogin = new Date();
          user.displayName = profile.displayName;
          user.avatar = profile.photos?.[0]?.value || user.avatar;
          if (approvedAdmins.includes(email)) {
            user.role = 'admin';
          }
          await user.save();
        } else {
          user = await User.create({
            googleId: profile.id,
            email,
            displayName: profile.displayName,
            avatar: profile.photos?.[0]?.value || '',
            role: approvedAdmins.includes(email) ? 'admin' : 'user',
            lastLogin: new Date(),
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
