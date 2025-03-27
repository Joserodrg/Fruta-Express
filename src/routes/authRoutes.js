// import express from "express";
// import passport from "passport";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import db from "../db/dbfruta.js";

// const router = express.Router();
// const SECRET_KEY = "00reset";

// // Ruta de registro
// router.post("/register", async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: "Faltan credenciales" });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   db.query(
//     "INSERT INTO users (username, password) VALUES (?, ?)",
//     [username, hashedPassword],
//     (err, result) => {
//       if (err)
//         return res
//           .status(500)
//           .json({ message: "Error al registrar usuario", error: err });
//       res.status(201).json({ message: "Usuario registrado con éxito" });
//     }
//   );
// });

// // Ruta de login
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return res.status(500).json({ message: "Error interno" });
//     if (!user) return res.status(401).json({ message: info.message });

//     const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
//       expiresIn: "1h",
//     });

//     res.json({ message: "Login exitoso", token });
//   })(req, res, next);
// });

// export default router;
