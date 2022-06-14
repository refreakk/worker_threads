const factorial = require('./factorial');
const  { Worker } = require('worker_threads');
const batchPromises = require('batch-promises');

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
        let arr = [[25, 20, 19, 48, 30, 50, 60, 70], [25, 20, 19, 48, 30, 50, 60, 70], [25, 20, 19, 48, 30, 50, 60, 70], [25, 20, 19, 48, 30, 50, 60, 70], [25, 20, 19, 48, 30, 50, 60, 70], [25, 20, 19, 48, 30, 50, 60, 70], [25, 20, 19, 48, 30, 50, 60, 70], [25, 20, 19, 48, 30, 50, 60, 70], [25, 20, 19, 48, 30, 50, 60, 70], [25, 20, 19, 48, 30, 50, 60, 70]];

        performance.mark('start');

        const result = await batchPromises(2, arr, i => new Promise((resolve, reject) => {
            const res = compute(i);
            resolve(res);

        })).then(results => {
            console.log(results); // [1,2,3,4,5]
        });

        console.log('результат: ', result);
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