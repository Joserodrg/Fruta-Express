// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import bcrypt from "bcryptjs";
// import db from "./db/dbfruta.js";

// passport.use(
//   new LocalStrategy(
//     { usernameField: "username" },
//     (username, password, done) => {
//       db.query(
//         "SELECT * FROM users WHERE username = ?",
//         [username],
//         async (err, results) => {
//           if (err) return done(err);
//           if (results.length === 0)
//             return done(null, false, { message: "Usuario no encontrado" });

//           const user = results[0];
//           const passwordMatch = await bcrypt.compare(password, user.password);

//           if (!passwordMatch)
//             return done(null, false, { message: "Contraseña incorrecta" });

//           return done(null, user);
//         }
//       );
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
//     if (err) return done(err);
//     return done(null, results[0]);
//   });
// });

// export default passport;
