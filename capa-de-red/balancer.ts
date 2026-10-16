// balancer.ts
import net from 'net';

const NODES: number[] = [3001, 3002, 3003];
let idx = 0;

const balancer = net.createServer((client: net.Socket) => {
  // Algoritmo Round-Robin
  const targetPort = NODES[idx % NODES.length];
  idx++;
  console.log(`Enrutando tráfico → Puerto ${targetPort}`);

  // Conectar con el Nodo Interno
  const node = net.createConnection({ port: targetPort });

  // Tubería bidireccional de datos
  client.pipe(node);
  node.pipe(client);

  // Manejo preventivo de fallos
  node.on('error', (err: Error) => {
    console.error(`Nodo ${targetPort} caído`);
    client.end('Error Interno del Servidor\n');
  });
});

balancer.listen(8080, () => console.log('Proxy OK en 8080'));
