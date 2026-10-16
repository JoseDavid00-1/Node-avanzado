// pipeline.ts
// Laboratorio 2 | Fase 3 - Paso 3: Ensamblaje Seguro de Tuberías
//
// Conecta ReadStream -> Transform -> WriteStream con el utilitario nativo
// pipeline(), que propaga correctamente los errores de memoria/stream.

import fs from 'fs';
import { pipeline } from 'stream';
import FormateadorCSV from './etl';

const input = fs.createReadStream('big.csv');
const transformer = new FormateadorCSV();
const output = fs.createWriteStream('final.txt');

// Profiler de RAM no bloqueante
const intervalo = setInterval(() => {
  const mb = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`[+] Consumo RAM: ${mb.toFixed(2)} MB`);
}, 500);

// pipeline gestiona memory leaks por errores (no usar .pipe() encadenados)
pipeline(input, transformer, output, (err) => {
  clearInterval(intervalo);
  if (err) console.error('Error de Stream', err);
  else console.log('Procesamiento completado sin crashear.');
});
