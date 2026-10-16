// node-server.ts
import net from 'net';

// Captura dinámica del puerto vía CLI
const PORT: number = Number(process.argv[2]) || 3001;
const NODE_ID = `Nodo-${PORT}`;

const server = net.createServer((socket: net.Socket) => {
  console.log(`[+] Conexión recibida en ${NODE_ID}`);

  // Simulación de carga (CPU-Bound Task)
  setTimeout(() => {
    socket.write(`Respuesta desde ${NODE_ID}\n`);
    socket.end(); // Liberar recursos
  }, 500);
});

server.listen(PORT, () => {
  console.log(`${NODE_ID} escuchando...`);
});
