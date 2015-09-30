var TestCafe   = require('../../../../../../lib/');
var ERROR_TYPE = require('../../../../../../lib/test-error/type');
var expect     = require('chai').expect;


describe('waitFor api tests', function () {
    var WAIT_FOR_API_TEST_SRC = './test/functional/tests/runner/api/wait-for/wait-for.test.js';

    var testCafe = null;
    var runner   = null;
    var errors   = [];

    function formatError (err) {
        errors.push(err);

        return err.stepName + ': ' + err.code + ' (actual:' + err.actual + ', expected: ' + err.expected + ')';
    }

    var silentStream = {
        write: function () {
        },
        end:   function () {
        }
    };

    // Fixture setup/teardown
    before(function () {
        testCafe = new TestCafe(1335, 1336);
    });

    after(function () {
        testCafe.close();
    });


    // Test setup/teardown
    beforeEach(function () {
        errors = [];
        runner = testCafe.createRunner();
        runner.browsers('chrome');
    });

    it('Should successfully run tests with base waitFor functionality', function (done) {
        var run = runner
            .reporter('list', process.stdout, formatError)
            .src(WAIT_FOR_API_TEST_SRC)
            .filter(function (testName) {
                return testName.indexOf('SHOULD FAIL:') < 0;
            })
            .run()
            .then(function (passed) {
                expect(passed).eql(true);
            });

        run
            .then(done)
            .catch(function (err) {
                done(err);
            });
    });

    it('Should fail when timeout is expired', function (done) {
        var run = runner
            .reporter('list', silentStream, formatError)
            .src(WAIT_FOR_API_TEST_SRC)
            .filter(function (testName) {
                return testName === 'SHOULD FAIL: when timeout is expired';
            })
            .run()
            .then(function (passed) {
                expect(passed).eql(false);
                expect(errors.length).eql(1);
                expect(errors[0].code).eql(ERROR_TYPE.waitForActionTimeoutExceeded);
            });

        run
            .then(done)
            .catch(function (err) {
                done(err);
            });
    });

    it('Should fail when event argument is incorrect', function (done) {
        var run = runner
            .reporter('list', silentStream, formatError)
            .src(WAIT_FOR_API_TEST_SRC)
            .filter(function (testName) {
                return testName === 'SHOULD FAIL: when event argument is incorrect';
            })
            .run()
            .then(function (passed) {
                expect(passed).eql(false);
                expect(errors.length).eql(1);
                expect(errors[0].code).eql(ERROR_TYPE.incorrectWaitForActionEventArgument);
            });

        run
            .then(done)
            .catch(function (err) {
                done(err);
            });
    });

    it('Should fail when timeout argument is incorrect', function (done) {
        var run = runner
            .reporter('list', silentStream, formatError)
            .src(WAIT_FOR_API_TEST_SRC)
            .filter(function (testName) {
                return testName === 'SHOULD FAIL: when timeout argument is incorrect';
            })
            .run()
            .then(function (passed) {
                expect(passed).eql(false);
                expect(errors.length).eql(1);
                expect(errors[0].code).eql(ERROR_TYPE.incorrectWaitForActionTimeoutArgument);
            });

        run
            .then(done)
            .catch(function (err) {
                done(err);
            });
    });

    it('Should fail when waitFor called for element and timeout expired', function (done) {
        var run = runner
            .reporter('list', silentStream, formatError)
            .src(WAIT_FOR_API_TEST_SRC)
            .filter(function (testName) {
                return testName === 'SHOULD FAIL: when waitFor called for element and timeout expired';
            })
            .run()
            .then(function (passed) {
                expect(passed).eql(false);
                expect(errors.length).eql(1);
                expect(errors[0].code).eql(ERROR_TYPE.waitForActionTimeoutExceeded);
            });

        run
            .then(done)
            .catch(function (err) {
                done(err);
            });
    });

    it('Should fail when waitFor called for several elements and timeout expired', function (done) {
        var run = runner
            .reporter('list', silentStream, formatError)
            .src(WAIT_FOR_API_TEST_SRC)
            .filter(function (testName) {
                return testName === 'SHOULD FAIL: when waitFor called for several elements and timeout expired';
            })
            .run()
            .then(function (passed) {
                expect(passed).eql(false);
                expect(errors.length).eql(1);
                expect(errors[0].code).eql(ERROR_TYPE.waitForActionTimeoutExceeded);
            });

        run
            .then(done)
            .catch(function (err) {
                done(err);
            });
    });
});
