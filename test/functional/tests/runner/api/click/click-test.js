var TestCafe = require('../../../../../../lib/');
var expect   = require('chai').expect;


describe('api tests', function () {
    var testCafe = null;
    var runner   = null;

    function formatError (err) {
        return err.stepName + ': ' + err.code + ' (actual:' + err.actual + ', expected: ' + err.expected + ')';
    }

    // Fixture setup/teardown
    before(function () {
        testCafe = new TestCafe(1335, 1336);
    });

    after(function () {
        testCafe.close();
    });


    // Test setup/teardown
    beforeEach(function () {
        runner = testCafe.createRunner();
        runner.browsers('chrome');
        runner.reporter('list', process.stdout, formatError);
    });

    describe('click', function () {
        it('Should work', function (done) {
            var run = runner
                .src('./test/functional/tests/runner/api/click/click.test.js')
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
    });
});
