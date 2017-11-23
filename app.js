const createTestCafe = require('./lib');

let serverTestCafe = null;
let clientTestCafe = null;
let serverRunner   = null;
let clientRunner   = null;

createTestCafe('localhost', 1335, 1336)
    .then(tc => {
        serverTestCafe = tc;
        serverRunner   = serverTestCafe.createRunner('server');

        return createTestCafe('localhost', 1337, 1338);
    })
    .then(tc => {
        clientTestCafe = tc;
        clientRunner   = tc.createRunner('client');

        clientRunner
            .src('./empty.js')
            .browsers('chrome')
            .reporter('json', {
                write: function () {
                },

                end: function () {
                }
            });

        return serverRunner
            .src(['./tests/test.js', './tests/assertion-test.js'])
            .browsers('chrome')
            .run();
    })
    .then(failedCount => {
        console.log('SUCCSESS: ' + failedCount);
        serverTestCafe.close();
        process.exit()
    })
    .catch(error => {
        console.log('FAILED');
        console.log(error);
        serverTestCafe.close();
        process.exit()
    });
