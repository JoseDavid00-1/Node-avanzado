import { PriorityQueue } from './queue';

interface ReporteData {
  mock: boolean;
}

interface TransferenciaData {
  user: string;
}

type TareaData = ReporteData | TransferenciaData;

const q = new PriorityQueue<TareaData>();

// Inyección Bloqueante Base Prio 1
console.log('Cargando 5000 reportes lentos...');
for (let i = 0; i < 5000; i++) {
  q.add(`Rep-${i}`, { mock: true }, 1);
}

// Despacho no bloqueante
q.start();

// Simulación Inyección Asíncrona Urgente
setTimeout(() => {
  console.log('\n--- LLEGA TRÁFICO VIP ---');
  q.add('Transf-A', { user: 'CEO' }, 10);
  q.add('Transf-B', { user: 'CFO' }, 10);
  q.add('Transf-C', { user: 'CTO' }, 10);
}, 2000);
// Valida que el Event Loop no está colapsado
