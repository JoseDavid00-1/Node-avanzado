import { parentPort } from 'node:worker_threads';

parentPort.on('message', ({iterations}) => {
    for (let i = 0; i < iterations; i++) {}
    parentPort.postMessage({message: 'hard from worker'});
});