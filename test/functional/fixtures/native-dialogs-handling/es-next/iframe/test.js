var errorInEachBrowserContains            = require('../../../../assertion-helper.js').errorInEachBrowserContains;
var getExpectedDialogNotAppearedErrorText = require('../../error-text.js').getExpectedDialogNotAppearedErrorText;
var getUnexpectedDialogErrorText          = require('../../error-text.js').getUnexpectedDialogErrorText;
var DIALOG_TYPE                           = require('../../../../../../lib/test-run/browser-dialogs.js').TYPE;
var config                                = require('../../../../config.js');


// NOTE: we set selectorTimeout to a large value in some tests to wait for
// an iframe to load on the farm (it is fast locally but can take some time on the farm)

var DEFAULT_SELECTOR_TIMEOUT             = 5000;
var DEFAULT_RUN_IN_IFRAME_OPTIONS        = { selectorTimeout: DEFAULT_SELECTOR_TIMEOUT };
var DEFAULT_FAILED_RUN_IN_IFRAME_OPTIONS = {
    shouldFail:      true,
    selectorTimeout: DEFAULT_SELECTOR_TIMEOUT
};

describe('[ES-NEXT] Native dialogs handling in iframe', function () {
    describe('Actions in iframe, dialogs in iframe', function () {
        it("Should pass if the expected alert dialog appears after an action", function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'Expected alert in iframe after an action in iframe',
                DEFAULT_RUN_IN_IFRAME_OPTIONS);
        });

        it("Should fail if the expected alert dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'No expected alert after an action in iframe',
                DEFAULT_FAILED_RUN_IN_IFRAME_OPTIONS)
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getExpectedDialogNotAppearedErrorText(DIALOG_TYPE.alert), 0);
                });
        });

        it('Should fail when an unexpected alert dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'Unexpected alert in iframe after an action in iframe',
                DEFAULT_FAILED_RUN_IN_IFRAME_OPTIONS)
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getUnexpectedDialogErrorText(DIALOG_TYPE.alert), 0);
                });
        });
    });

    describe('Actions in top window, dialogs in iframe', function () {
        it("Should pass if the expected alert dialog appears after an action", function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'Expected alert in iframe after an action in top window');
        });

        it('Should fail when an unexpected alert dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'Unexpected alert in iframe after an action in top window',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, getUnexpectedDialogErrorText(DIALOG_TYPE.alert), 0);
                });
        });
    });

    describe('Actions in iframe, dialogs in top window', function () {
        it("Should pass if the expected alert dialog appears after an action", function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'Expected alert in top window after an action in iframe',
                DEFAULT_RUN_IN_IFRAME_OPTIONS);
        });

        it('Should fail when an unexpected alert dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'Unexpected alert in top window after an action in iframe',
                DEFAULT_FAILED_RUN_IN_IFRAME_OPTIONS)
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getUnexpectedDialogErrorText(DIALOG_TYPE.alert), 0);
                });
        });
    });

    describe('Actions in child iframe, dialogs in parent iframe', function () {
        it("Should pass if the expected alert dialog appears after an action", function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'Expected alert in parent iframe after an action in child iframe',
                DEFAULT_RUN_IN_IFRAME_OPTIONS);
        });

        it('Should fail when an unexpected alert dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'Unexpected alert in parent iframe after an action in child iframe',
                DEFAULT_FAILED_RUN_IN_IFRAME_OPTIONS)
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getUnexpectedDialogErrorText(DIALOG_TYPE.alert), 0);
                });
        });
    });

    describe('Actions in parent iframe, dialogs in child iframe', function () {
        it("Should pass if the expected alert dialog appears after an action", function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'Expected alert in child iframe after an action in parent iframe',
                DEFAULT_RUN_IN_IFRAME_OPTIONS);
        });

        it('Should fail when an unexpected alert dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/in-iframe-test.js', 'Unexpected alert in child iframe after an action in parent iframe',
                DEFAULT_FAILED_RUN_IN_IFRAME_OPTIONS)
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getUnexpectedDialogErrorText(DIALOG_TYPE.alert), 0);
                });
        });
    });

    describe('Dialogs appear after page load', function () {
        it.only('Should pass if the expected confirm dialog appears after page load', function () {
            return runTests('./testcafe-fixtures/page-load-test.js', 'Expected dialogs after page load');
        });

        it("Should fail if the expected confirm dialog doesn't appear after page load", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected confirm after page load',
                { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getExpectedDialogNotAppearedErrorText(DIALOG_TYPE.confirm), 0);
                    errorInEachBrowserContains(errs,
                        '139 |    await t ' +
                        '> 140 |        .handleConfirm(true, { timeout: WAIT_FOR_DIALOG_TIMEOUT });',
                        0);
                });
        });

        it('Should fail when an unexpected alert dialog appears after page load', function () {
            return runTests('./testcafe-fixtures/page-load-test.js', 'Unexpected alert after page load',
                { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getUnexpectedDialogErrorText(DIALOG_TYPE.alert), 0);
                    errorInEachBrowserContains(errs, '> 26 |    await t.click(\'body\'); ', 0);
                });
        });
    });
});
