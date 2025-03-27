// import express from "express";
// import db from "../db/dbfruta.js";
// import { authenticateToken } from "../middlewares/isAuthenticated.js";

// const router = express.Router();

// router.get("/productos", authenticateToken, (req, res) => {
//   db.query("SELECT * FROM productos", (err, result) => {
//     if (err) return res.status(500).json({ message: "Error en la consulta" });
//     res.json(result);
//   });
// });

// router.get("/productos/:id", authenticateToken, (req, res) => {
//   const { id } = req.params;

//   db.query("SELECT * FROM productos WHERE id = ?", [id], (err, result) => {
//     if (err) return res.status(500).json({ message: "Error en la consulta" });
//     if (result.length === 0)
//       return res.status(404).json({ error: "Producto no encontrado" });

//     res.json(result[0]);
//   });
// });

// export default router;
