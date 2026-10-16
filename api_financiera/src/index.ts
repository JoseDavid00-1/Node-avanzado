import express from "express";
import apiRoutes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use("/api/v1", apiRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const server = app.listen(PORT, () => {
  console.log(`API Financiera escuchando en http://localhost:${PORT}`);
});

// Cierra conexiones activas para que tsx watch pueda reiniciar sin forzar el kill
function shutdown(signal: string) {
  console.log(`${signal} recibido, cerrando servidor...`);
  server.close(() => process.exit(0));
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
