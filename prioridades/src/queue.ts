export interface Tarea<T = unknown> {
  id: string;
  data: T;
  priority: number;
}

// En hardware moderno, JSON.stringify de un objeto trivial tarda microsegundos,
// por lo que 5000 tareas drenan en milisegundos y nunca coinciden con la
// inyección VIP a los 2s. Este spin de CPU calibrado (~0.7ms/tarea) simula el
// "esfuerzo pesado" real que el laboratorio espera observar en la Fase 3.
const SIMULATED_WORK_ITERATIONS = 150_000;

function simulateCpuWork(): number {
  let acc = 0;
  for (let i = 0; i < SIMULATED_WORK_ITERATIONS; i++) acc += Math.sqrt(i) % 7;
  return acc;
}

export class PriorityQueue<T = unknown> {
  private tareas: Tarea<T>[] = [];
  private isProcessing = false;

  // Escala prioridades: 1 (Baja) a 10 (Urgente)
  add(id: string, data: T, priority = 1): void {
    this.tareas.push({ id, data, priority });

    // Reordenamiento inmediato tras inserción
    // (Apto para este lab. Prod requiere Min-Heap)
    this.tareas.sort((a, b) => b.priority - a.priority);
  }

  get length(): number {
    return this.tareas.length;
  }

  next(): Tarea<T> | undefined {
    return this.tareas.shift();
  }

  start(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this._processLoop();
  }

  private _processLoop(): void {
    if (this.length === 0) {
      this.isProcessing = false;
      console.log('Cola vaciada.');
      return;
    }

    const tarea = this.next()!;
    JSON.stringify(tarea.data); // Esfuerzo Simulado
    simulateCpuWork(); // Esfuerzo Simulado adicional (ver nota de calibración arriba)

    if (tarea.priority > 5) {
      console.log(`[URGENTE] Procesado: ${tarea.id}`);
    }

    // MAGIA: Liberar Event Loop en cada iteración
    setImmediate(() => {
      this._processLoop();
    });
  }
}
