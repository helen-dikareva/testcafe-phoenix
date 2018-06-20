var errorInEachBrowserContains = require('../../../../assertion-helper.js').errorInEachBrowserContains;

var RUN_CONFIG = {
    shouldFail:       true,
    only:             'chrome',
    selectorTimeout:  3000,
    assertionTimeout: 3000
};

// NOTE: we run tests in chrome only, because we mainly test server API functionality.
describe.only('[Raw API] test server side code execution', function () {
    it('Should execute test with server var', function () {
        return runTests('./testcafe-fixtures/index.testcafe', 'Use server string variable in assertion', RUN_CONFIG)
            .catch(function (errs) {
                errorInEachBrowserContains(errs, 'AssertionError: expected \'123\' to deeply equal \'abc\'', 0);
            });
    });

    it('Should execute action with selector var', function () {
        return runTests('./testcafe-fixtures/index.testcafe', 'Use selector variable in action', RUN_CONFIG)
            .catch(function (errs) {
                errorInEachBrowserContains(errs, 'Input was clicked!', 0);
            });
    });

    it('Should execute assertion with selector property', function () {
        return runTests('./testcafe-fixtures/index.testcafe', 'Use selector variable property in assertion', RUN_CONFIG)
            .catch(function (errs) {
                errorInEachBrowserContains(errs, 'AssertionError: expected \'input value\' to deeply equal \'abc\'', 0);
            });
    });

    it('Should execute assertion with selector method', function () {
        return runTests('./testcafe-fixtures/index.testcafe', 'Use selector variable method in assertion', RUN_CONFIG)
            .catch(function (errs) {
                errorInEachBrowserContains(errs, 'AssertionError: expected \'input data attr\' to deeply equal \'abc\'', 0);
            });
    });

    it.only('Should ', function () {
        return runTests('./testcafe-fixtures/index.testcafe', 'Visibility check', RUN_CONFIG)
            .catch(function (errs) {
                errorInEachBrowserContains(errs, 'Input was clicked!', 0);
            });
    });
});
