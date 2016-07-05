var expect                                    = require('chai').expect;
var errorInEachBrowserContains                = require('../../assertion-helper.js').errorInEachBrowserContains;
var getNativeDialogNotHandledErrorText        = require('./errors.js').getNativeDialogNotHandledErrorText;
var getUncaughtErrorInNativeDialogHandlerText = require('./errors.js').getUncaughtErrorInNativeDialogHandlerText;


describe('Native dialogs handling', function () {
    describe('Errors during dialogs handling', function () {
        it('Should fail if an unexpected confirm dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Without handler',
                { shouldFail: true, skipJsErrors: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getNativeDialogNotHandledErrorText('confirm'), 0);
                    errorInEachBrowserContains(errs, '> 14 |    await t.click(\'#buttonConfirm\'); ', 0);
                });
        });

        it('Should pass if the expected confirm dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Expected confirm after an action');
        });

        it('Should pass if the expected confirm dialog appears after an action (with dependencies)', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Expected confirm after an action (with dependencies)');
        });

        it('Should pass if the expected confirm dialog appears after an action (client function)', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Expected confirm after an action (client function)');
        });

        it('Should pass if different dialogs appear after actions', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Different dialogs after actions');
        });

        it('Should fail if confirm dialog appears with wrong text', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Confirm dialog with wrong text', { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getUncaughtErrorInNativeDialogHandlerText('confirm', 'Wrong dialog text'), 0);
                    errorInEachBrowserContains(errs, '> 79 |        .click(\'#buttonConfirm\');', 0);
                });
        });

        it("Should fail if the expected confirm dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected confirm after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, 'AssertionError: expected 0 to equal 1', 0);
                    errorInEachBrowserContains(errs, '> 91 |    expect(info.length).equals(1);', 0);
                });
        });

        it('Should pass if the expected beforeUnload dialog appears after an action', function () {

            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Expected beforeUnload after an action', {
                // https://github.com/DevExpress/testcafe-hammerhead/issues/698
                skip: 'safari'
            });
        });
    });

    describe('Dialogs appear after page load', function () {
        it('Should pass if the expected confirm dialog appears after page load', function () {
            return runTests('./testcafe-fixtures/page-load-test.js', 'Expected dialogs after page load');
        });

        it('Should fail when an unexpected alert dialog appears after page load', function () {
            return runTests('./testcafe-fixtures/page-load-test.js', 'Unexpected alert after page load',
                { shouldFail: true })
                .catch(function (errs) {
                    // NOTE: due to https://github.com/DevExpress/testcafe/issues/663
                    // we don't check dialog type for iphone,ipad
                    if (errs instanceof Error)
                        throw errs;

                    // NOTE: if errors are the same in different browsers
                    if (Array.isArray(errs))
                        expect(errs[0]).contains(getNativeDialogNotHandledErrorText('alert'));
                    else {
                        Object.keys(errs).forEach(function (err) {
                            if (!/iphone|ipad/.test(err))
                                expect(errs[err][0]).contains(getNativeDialogNotHandledErrorText('alert'));
                            else {
                                expect(errs[err][0]).contains('dialog was invoked, but no handler was set for it. ' +
                                                              'Use the "setNativeDialogHandler" function to introduce' +
                                                              ' a handler function for native dialogs.');
                            }
                        });
                    }

                    errorInEachBrowserContains(errs, '> 28 |    await t.click(\'body\');', 0);
                });
        });
    });

    describe('Dialogs appear after redirect', function () {
        it('Should handle prompt dialogs', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Expected alert and prompt after redirect');
        });

        it('Should fail when an unexpected prompt dialog appears after redirect', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected prompt after redirect',
                { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getNativeDialogNotHandledErrorText('prompt'), 0);
                });
        });
    });

    describe('Dialog appears during a wait action', function () {
        it('Should pass if expected alert dialog appears during a wait action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Expected alert during a wait action');
        });

        it("Should fail if the expected alert dialog doesn't appear during a wait action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected alert during a wait action',
                { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, 'AssertionError: expected 0 to equal 1', 0);
                    errorInEachBrowserContains(errs, '> 147 |    expect(info.length).equals(1);', 0);
                });
        });

        it('Should fail when an unexpected alert dialog appears during a wait action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected alert during a wait action',
                { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, getNativeDialogNotHandledErrorText('alert'), 0);
                });
        });
    });

    describe('Set dialog handler errors', function () {
        it('Should fail if dialog handler has wrong type', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Dialog handler has wrong type', { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, 'The native dialog handler is expected to be specified as a regular function or ClientFunction, but number was passed.', 0);
                    errorInEachBrowserContains(errs, ' > 158 |    await t.setNativeDialogHandler(42);', 0);
                });
        });

        it('Should fail if client function argument has wrong type', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Client function argument wrong type', { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, 'ClientFunction code is expected to be specified as a function, but number was passed.', 0);
                    errorInEachBrowserContains(errs, ' > 162 |    await t.setNativeDialogHandler(ClientFunction(42));', 0);
                });
        });

        it('Should fail if Selector send as dialog handler', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Selector as dialogHandler', { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, 'The native dialog handler is expected to be specified as a regular function or ClientFunction, but Selector was passed.', 0);
                    errorInEachBrowserContains(errs, '> 168 |    await t.setNativeDialogHandler(dialogHandler);', 0);
                });
        });
    });
});
