// seed.ts
// Laboratorio 2 | Fase 1 - Paso 1: Sembrado Masivo Controlado
//
// Genera un CSV masivo escribiendo en bloques y respetando la contrapresión
// (backpressure) del WriteStream para mantener el consumo de RAM estático.

import fs from 'fs';

const out = fs.createWriteStream('big.csv');
let iter = 10_000_000; // Total altísimo de iteraciones para forzar ~1GB

function escribirBloque(): void {
  let ok = true;

  while (iter > 0 && ok) {
    iter--;
    const fila = `${iter},${Math.random() * 5000},ACTIVO\n`;

    if (iter === 0) out.write(fila);
    else ok = out.write(fila); // Retorna false si el buffer interno se llena
  }

  if (iter > 0) {
    // Backpressure detectado. Pausamos y esperamos el evento 'drain'.
    out.once('drain', escribirBloque);
  } else {
    console.log('Sembrado Masivo Completado.');
  }
}

escribirBloque();
