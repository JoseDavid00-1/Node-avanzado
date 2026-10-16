// test.ts
import net from 'net';

for (let i = 1; i <= 6; i++) {
  const client = net.createConnection({ port: 8080 });
  client.write('Ping\n');
  client.on('data', (d: Buffer) => {
    console.log(`Req ${i}: ${d}`);
    client.end();
  });
}
