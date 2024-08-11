import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Utente from '../models/Utente.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let utente = await Utente.findOne({ googleId: profile.id });

      if (!utente) {
        utente = new Utente({
          googleId: profile.id,
          nome: profile.name.givenName,
          cognome: profile.name.familyName,
          email: profile.emails[0].value
        });
        await utente.save();
      }

      done(null, utente);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.serializeUser((utente, done) => {
  done(null, utente.id);
});

passport.deserializeUser((id, done) => {
  Utente.findById(id, (err, utente) => {
    done(err, utente);
  });
});

export default passport;