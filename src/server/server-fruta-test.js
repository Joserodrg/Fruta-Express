// import express from "express";
// import cors from "cors";
// import * as mysql from "mysql2";
// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import bcrypt from "bcryptjs";
// import { authenticateToken } from "../middlewares/isAuthenticated.js";

// // Initialize express app
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(passport.initialize());

// // Database connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "00reset",
//   database: "fruta",
// });

// const connected = () => {
//   db.connect((err) => {
//     if (err) {
//       console.log("Unable to Connect...");
//       return;
//     }
//     console.log("Connection Successfully");
//   });
// };
// passport.use(
//   new LocalStrategy((username, password, done) => {
//     db.query(
//       "SELECT * FROM users WHERE username = ?",
//       [username],
//       (err, result) => {
//         if (err) return done(err);

//         if (result.length === 0) {
//           return done(null, false, { message: "Usuario no encontrado" });
//         }

//         const user = result[0];

//         // Comparar la contraseña con bcrypt
//         bcrypt.compare(password, user.password, (err, isMatch) => {
//           if (err) return done(err);

//           if (!isMatch) {
//             return done(null, false, { message: "Contraseña incorrecta" });
//           }

//           return done(null, user); // Autenticación exitosa
//         });
//       }
//     );
//   })
// );
// // Serialize and Deserialize User
// passport.serializeUser((user, done) => {
//   done(null, user.id); // Store user ID in session
// });

// passport.deserializeUser((id, done) => {
//   db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
//     if (err) return done(err);
//     done(null, result[0]);
//   });
// });

// // ENDPOINTS
// app.use("/productos", authenticateToken);

// app.get("/productos", (req, res) => {
//   db.query("SELECT * FROM productos", (err, result) => {
//     if (err) {
//       console.error("Error en la consulta SQL", err);
//       return res.status(500).send("No se pudo realizar la consulta");
//     }
//     res.json(result);
//   });
// });

// app.get("/productos/:id", (req, res) => {
//   const { id } = req.params;

//   db.query("SELECT * FROM productos WHERE id = ?", [id], (err, result) => {
//     if (err) {
//       console.error("Error en la consulta SQL", err);
//       return res.status(500).send("No se pudo realizar la consulta");
//     }

//     if (result.length === 0) {
//       return res.status(404).json({ error: "Producto no encontrado" });
//     }

//     res.json(result[0]);
//   });
// });

// app.post("/productos", (req, res) => {
//   const { nombre, tipo, precio, stock } = req.body;

//   // If no 'fecha_ingreso', use current date and time
//   const fecha_ingreso =
//     req.body.fecha_ingreso ||
//     new Date().toISOString().slice(0, 19).replace("T", " ");

//   db.query(
//     `INSERT INTO productos (nombre, tipo, precio, stock, fecha_ingreso) VALUES (?, ?, ?, ?, ?)`,
//     [nombre, tipo, precio, stock, fecha_ingreso],
//     (err, result) => {
//       if (err) {
//         console.error("Error en la consulta SQL", err);
//         return res.status(500).json({
//           message: "Error al agregar producto en la base de datos",
//           error: err.message,
//         });
//       }
//       res.status(201).json({
//         message: "Producto añadido con éxito",
//         id: result.insertId,
//       });
//     }
//   );
// });

// app.delete("/productos/:id", (req, res) => {
//   const { id } = req.params;

//   db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
//     if (err) {
//       console.log("Error en la consulta SQL", err);
//       return res.status(500).send("No se pudo realizar la consulta");
//     }
//     res.status(200).json({
//       message: "Producto eliminado con éxito",
//       id: id,
//     });
//   });
// });

// app.put("/productos/:id", (req, res) => {
//   const { nombre, tipo, precio, stock } = req.body;
//   const { id } = req.params;

//   db.query(
//     "UPDATE productos SET nombre=?, tipo=?, precio=?, stock=? WHERE id=?",
//     [nombre, tipo, precio, stock, id],
//     (err, result) => {
//       if (err) {
//         console.log("Error en la consulta SQL", err);
//         return res.status(500).send("No se pudo realizar la consulta");
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: "Producto no encontrado" });
//       }

//       res.status(200).json({
//         message: "Producto actualizado con éxito",
//         id: id,
//         nombre,
//         tipo,
//         precio,
//         stock,
//       });
//     }
//   );
// });

// app.post(
//   "/login",
//   passport.authenticate("local", { session: false }),
//   (req, res) => {
//     const user = req.user;

//     // Generar token JWT después de la autenticación
//     if (!user) {
//       return res
//         .status(401)
//         .json({ message: "Usuario o contraseña incorrectos" });
//     }

//     const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
//       expiresIn: "1h",
//     });

//     res.json({
//       success: true,
//       message: "Login exitoso",
//       token: token, // El token es enviado al frontend
//     });
//   }
// );

// connected();

// // Start the server
// const PORT = 5001;
// app.listen(PORT, () => {
//   console.log("Server Listening on PORT:", PORT);
// });
