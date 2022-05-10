const factorial = require('./factorial');
const  { Worker } = require('worker_threads');

const compute = (array) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', { // файл для запуска в отдельным потоке
            workerData: {
                array
            }
        });

        worker.on('message', (msg) => {
            console.log(worker.threadId)
            resolve(msg);
        });
        worker.on('error', (err) => {
            reject(err);
        });
        worker.on('exit', () => {
            console.log('Завершил работу');
        });
    });
}

const main = async () => {
    try {
        performance.mark('start');
        const result = await Promise.all([
            compute([25, 20, 19, 48, 30, 50, 60, 70]),
            compute([25, 20, 19, 48, 30, 50, 60, 70]),
            compute([25, 20, 19, 48, 30, 50, 60, 70]),
            compute([25, 20, 19, 48, 30, 50, 60, 70])
        ]);
        console.log(result);
        performance.mark('end');
        performance.measure('main', 'start', 'end');
        console.log(performance.getEntriesByName('main').pop());
    } catch (err) {
        console.error(err.message);
    }
}

setTimeout(() => {
    console.log('timeout');
}, 1000)

main();