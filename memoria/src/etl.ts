// etl.ts
// Laboratorio 2 | Fase 2 - Paso 2: Transformador de Memoria Fija
//
// Transform stream que procesa el CSV por chunks (64KB por defecto) en lugar
// de cargarlo completo en memoria, manteniendo un consumo de RAM constante.

import { Transform, TransformCallback } from 'stream';

class FormateadorCSV extends Transform {
  // chunk es un Buffer que recibe datos por partes
  _transform(chunk: Buffer, _encoding: BufferEncoding, callback: TransformCallback): void {
    // Parseo a texto y transformación pesada
    const dataTexto = chunk.toString();
    const dataMutada = dataTexto.replace(/,/g, ' | ');

    // Enviar al stream de lectura interno
    this.push(dataMutada);

    // Señalización de finalización de bloque
    callback();
  }
}

export default FormateadorCSV;
