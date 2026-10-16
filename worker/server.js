import express from 'express';
import { Worker } from 'node:worker_threads';

const app = express();
const PORT = 3000;

app.get('/fast', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Hello from fast!' });
});

app.get('/slow', (req, res) => {
    setTimeout(() => {
        res.status(200).json({ status: 'success', message: 'Hello from slow!' });
    }, 5000);
});

app.get('/hard', (req, res) => {
    console.time('hardRequest');
    for (let i = 0; i < 5_000_000_000; i++) {}
    console.timeEnd('hardRequest');
    res.status(200).json({ message: 'hard_request_completed' });
});

const runHardWork = async (iterations) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('./worker.js', import.meta.url));
        worker.on('message', (message) => {resolve(message)});
        worker.on('error', reject);
        worker.postMessage({ iterations });
    });
};

app.get('/hard-worker', async (req, res) => {
    console.time('hardWorkerRequest');
    const result = await runHardWork(5_000_000_000);
    console.timeEnd('hardWorkerRequest');
    res.status(200).json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});