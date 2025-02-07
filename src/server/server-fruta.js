import express from "express";
import cors from "cors";
import * as mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

const db = mysql.createConnection({
  host: "localhost", //ip
  user: "root",
  password: "00reset",
  database: "fruta",
});

const connected = () => {
  db.connect((err) => {
    if (err) {
      console.log("Unable to Connect...");
      return;
    }
    console.log("Connection Successfully");
  });
};

// ENDPOINTS

// GET

app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, result) => {
    if (err) {
      console.err("Error en la consulta SQL", err);
      return res.status(500).send("No se pudo realizar la consulta");
    }
    res.json(result);
  });
});

// POST

app.post("/productos", (req, res) => {
  const { productos } = req.body;

  db.query(`INSERT INTO productos (nombre,
        tipo,
        precio,
        fecha_ingreso)
        VALUES (?, ?, ?, ?)`),
    [productos],
    (err, result) => {
      if (err) {
        console.log("Error en la consulta SQL", err);
        return res.status(500).send("No se pudo realizar la consulta");
      }
      res.status(201).json({
        message: "Producto añadido con exito",
        id: result.insertId,
      });
    };
});

// DELETE

app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log("Error en la consulta SQL", err);
      return req.status(500).send("No se pudo realizar la consulta");
    }
    res.status(200).json({
      message: "Producto eliminado con exito",
      id: id,
    });
  });
});

// PUT

app.put("/productos/:id", (req, res) => {
  const { id, nombre, tipo, precio, stock, fecha_ingreso } = req.body;

  db.query(
    "UPDATE productos SET nombre=?, tipo=?, precio=?, stock=?, fecha_ingreso WHERE id=?",
    [id, nombre, tipo, precio, stock, fecha_ingreso],
    (err, result) => {
      if (err) {
        console.log("Error en la consulta SQL", err);
        return req.status(500).send("No se pudo realizar la consulta");
      }
      res.status(200).json({
        message: "producto actualizado:",
        id: id,
        nombre: nombre,
        tipo: tipo,
        precio: precio,
        stock: stock,
        fecha_ingreso: fecha_ingreso,
      });
    }
  );
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

connected();
