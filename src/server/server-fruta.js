import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { authenticateToken } from "../middlewares/isAuthenticated.js";
import pkg from "pg";
const { Client } = pkg;

import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const PORT = 5001;

const db = new Client({
  host: "localhost",
  user: "postgres",
  password: "00reset",
  database: "fruta",
});

db.connect()
  .then(() => console.log("Conexion Exitosa"))
  .catch((err) => console.log("Error de conexión", err));

// Estrategia de Passport para autenticar el usuario
passport.use(
  new LocalStrategy((username, password, done) => {
    db.query(
      "SELECT * FROM users WHERE username = $1", // Cambié ? por $1
      [username],
      (err, result) => {
        if (err) return done(err);
        if (result.rows.length === 0) {
          // Cambié result.length por result.rows.length
          console.log("Usuario no encontrado");
          return done(null, false, { message: "Usuario no encontrado" });
        }

        const user = result.rows[0]; // Cambié result[0] por result.rows[0]

        // Verificar si las contraseñas coinciden
        if (password !== user.password) {
          console.log("Contraseña incorrecta");
          return done(null, false, { message: "Contraseña Incorrecta" });
        }

        console.log("Login exitoso, usuario autenticado");
        return done(null, user);
      }
    );
  })
);

// Serializar y deserializar el usuario (es necesario para mantener la sesión en Passport)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM users WHERE id = $1", [id], (err, result) => {
    // Cambié ? por $1
    if (err) return done(err);
    done(null, result.rows[0]); // Cambié result[0] por result.rows[0]
  });
});

app.use(passport.initialize());

// Ruta de login para autenticar el usuario y generar un JWT
app.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const user = req.user; // `user` viene del Passport si la autenticación fue exitosa

    // Generar un JWT tras la autenticación exitosa
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login exitoso",
      token: token,
    });
  }
);

// Middleware para proteger las rutas con JWT
app.use("/productos", authenticateToken);

// Rutas de productos
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, result) => {
    if (err) {
      console.error("Error en la consulta SQL", err);
      return res.status(500).send("No se pudo realizar la consulta");
    }
    res.json(result.rows); // Cambié result por result.rows
  });
});

app.get("/productos/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM productos WHERE id = $1", [id], (err, result) => {
    // Cambié ? por $1
    if (err) {
      console.error("Error en la consulta SQL", err);
      return res.status(500).send("No se pudo realizar la consulta");
    }

    if (result.rows.length === 0) {
      // Cambié result.length por result.rows.length
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(result.rows[0]); // Cambié result[0] por result.rows[0]
  });
});

app.post("/productos", (req, res) => {
  const { nombre, tipo, precio, stock, fecha_ingreso } = req.body;

  // Verificar que todos los campos estén presentes
  if (!nombre || !tipo || !precio || !stock) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // Si fecha_ingreso no está presente, asigna la fecha actual
  const fechaIngreso = fecha_ingreso || new Date().toISOString().split("T")[0];

  db.query(
    `INSERT INTO productos (nombre, tipo, precio, stock, fecha_ingreso) 
     VALUES ($1, $2, $3, $4, $5) RETURNING id`, // Cambié ? por $1, $2, $3...
    [nombre, tipo, precio, stock, fechaIngreso],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta SQL:", err);
        return res.status(500).json({
          message: "Error al agregar producto en la base de datos",
          error: err.message,
        });
      }
      res.status(201).json({
        message: "Producto añadido con éxito",
        id: result.rows[0].id, // Cambié result.insertId por result.rows[0].id
      });
    }
  );
});

// Ruta PUT para actualizar un producto
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, precio, stock, fecha_ingreso } = req.body;

  // Verificar si el producto existe
  db.query("SELECT * FROM productos WHERE id = $1", [id], (err, result) => {
    // Cambié ? por $1
    if (err) {
      console.error("Error en la consulta SQL:", err);
      return res.status(500).json({
        message: "Error al actualizar producto",
        error: err.message,
      });
    }

    if (result.rows.length === 0) {
      // Cambié result.length por result.rows.length
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const fechaIngreso =
      fecha_ingreso || new Date().toISOString().split("T")[0];

    db.query(
      "UPDATE productos SET nombre = $1, tipo = $2, precio = $3, stock = $4, fecha_ingreso = $5 WHERE id = $6",
      [nombre, tipo, precio, stock, fechaIngreso, id],
      (err, updateResult) => {
        if (err) {
          console.error("Error al actualizar producto:", err);
          return res.status(500).json({
            message: "Error al actualizar producto",
            error: err.message,
          });
        }

        res.status(200).json({
          message: "Producto actualizado con éxito",
          id,
        });
      }
    );
  });
});

app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM productos WHERE id = $1", [id], (err, result) => {
    // Cambié ? por $1
    if (err) {
      console.log("Error en la consulta SQL", err);
      return res.status(500).send("No se pudo realizar la consulta");
    }
    res.status(200).json({
      message: "Producto eliminado con éxito",
      id: id,
    });
  });
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
