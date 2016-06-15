var errorInEachBrowserContains = require('../../../assertion-helper.js').errorInEachBrowserContains;


describe.only('[ES-NEXT] Native dialogs handling', function () {
    describe('Errors during dialogs handling', function () {
        it("Should fail if the expected alert dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected alert after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, 'The expected system alert dialog did not appear.', 0);
                    errorInEachBrowserContains(errs,
                        '11 |    await t ' +
                        '12 |        .click(\'#withoutDialog\')' +
                        ' > 13 |        .handleAlert(); ',
                        0)
                });
        });

        it('Should fail when an unexpected alert dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected alert after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, 'Unexpected system alert dialog with text "Alert!" appeared.', 0);
                    errorInEachBrowserContains(errs,
                        '17 |    await t > ' +
                        '18 |        .click(\'#buttonAlert\'); ',
                        0);
                });
        });

        it("Should fail if the expected confirm dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected confirm after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, 'The expected system confirm dialog did not appear.', 0);
                    errorInEachBrowserContains(errs,
                        '23 |    await t ' +
                        '24 |        .click(\'#withoutDialog\') ' +
                        '> 25 |        .handleConfirm(true);',
                        0);
                });
        });

        it('Should fail when an unexpected confirm dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected confirm after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, 'Unexpected system confirm dialog with text "Confirm?" appeared.', 0);
                    errorInEachBrowserContains(errs,
                        '29 |    await t ' +
                        '> 30 |        .click(\'#buttonConfirm\');',
                        0);
                });
        });

        it("Should fail if the expected prompt dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected prompt after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, 'The expected system prompt dialog did not appear.', 0);
                    errorInEachBrowserContains(errs,
                        'await t ' +
                        '36 |        .click(\'#withoutDialog\') ' +
                        '> 37 |        .handlePrompt(\'text\');',
                        0);
                });
        });

        it('Should fail when an unexpected prompt dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected prompt after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, 'Unexpected system prompt dialog with text "Prompt:" appeared.', 0);
                    errorInEachBrowserContains(errs,
                        '41 |    await t ' +
                        '> 42 |        .click(\'#buttonPrompt\');',
                        0);
                });
        });

        it("Should fail if the expected beforeUnload dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected beforeUnload after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, 'The expected system beforeunload dialog did not appear.', 0);
                    errorInEachBrowserContains(errs,
                        '47 |    await t ' +
                        '48 |        .click(\'#linkToThisPage\') ' +
                        '> 49 |        .handleBeforeUnload();',
                        0);
                });
        });

        it('Should fail when an unexpected beforeUnload dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected beforeUnload after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, 'Unexpected system beforeunload dialog with text "Before unload" appeared.', 0);
                    errorInEachBrowserContains(errs,
                        ' 53 |    await t ' +
                        '54 |        .click(\'#enableBeforeUnload\') ' +
                        '> 55 |        .click(\'#linkToThisPage\'); ',
                        0);
                });
        });
    });

    describe('Dialogs sequence', function () {
        it('Should pass if dialogs sequence appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Dialogs sequence appears after an action');
        });

        it("Should fail if the expected prompt dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected prompt in dialogs sequence after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, 'The expected system prompt dialog did not appear.', 0);
                    errorInEachBrowserContains(errs,
                        '73 |    await t ' +
                        '74 |        .click(\'#buttonAlertConfirm\') ' +
                        '75 |        .handleAlert() ' +
                        '76 |        .handleConfirm(true) ' +
                        '> 77 |        .handlePrompt(null);',
                        0);
                });
        });

        it('Should fail when an unexpected confirm dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected confirm in dialogs sequence after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    errorInEachBrowserContains(errs, 'Unexpected system confirm dialog with text "Confirm?" appeared.', 0);
                    errorInEachBrowserContains(errs,
                        '81 |    await t ' +
                        '> 82 |        .click(\'#buttonDialogsSequence\') ' +
                        '83 |        .handleAlert() ' +
                        '84 |        .handlePrompt();',
                        0);
                });
        });
    });

    describe('Dialog appears after timeout', function () {
        it("Should pass if the timeout for waiting dialog exceeds time required for the dialogs to appear", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Dialog alert appears with some timeout after redirect',
                { elementAvailabilityTimeout: 1500 });
        });

        it('Should fail if the timeout for waiting dialog is less than time required for the dialog to appear', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Dialog alert appears with some timeout after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    errorInEachBrowserContains(errs, 'The expected system alert dialog did not appear.', 0);
                });
        });
    });

    /*it('Should pass if the expected confirm dialog appears after page load', function () {
        return runTests('./testcafe-fixtures/confirm-page-test.js', 'Expected confirm after page load');
    });

    it("Should fail if the expected confirm dialog doesn't appear after page load", function () {
        return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected confirm after page load',
            { shouldFail: true })
            .catch(function (errs) {
                console.log(errs);
                errorInEachBrowserContains(errs, 'The expected system confirm dialog did not appear.', 0);
                errorInEachBrowserContains(errs, '> 46 |        .handleConfirm(true) ', 0);
            });
    });

    it('Should fail when an unexpected confirm dialog appears after page load', function () {
        return runTests('./testcafe-fixtures/confirm-page-test.js', 'Unexpected confirm after page load',
            { shouldFail: true })
            .catch(function (errs) {
                console.log(errs);
                errorInEachBrowserContains(errs, 'Unexpected system confirm dialog with text "Confirm?" appeared.', 0);
                errorInEachBrowserContains(errs, ' > 12 |    await t.click(\'body\');', 0);
            });
    });*/
});

/*var expect = require('chai').expect;


describe('Native dialogs handling', function () {


    describe('Dialogs appear after redirect', function () {
        it('Should handle confirm dialogs', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Expected confirm after redirect');
        });

        it('Should handle prompt dialogs', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Expected prompt after redirect');
        });

        it('Should handle dialogs before and after redirect', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Expected dialogs before and after redirect');
        });

        it("Should fail if the expected confirm dialog doesn't appear", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected confirm after redirect',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('The expected system confirm dialog did not appear.');
                    expect(errs[0]).contains(
                        '> 148 |        .click(\'#linkToThisPage\', { ' +
                        '149 |            handleDialogs: { confirm: { result: true } } ' +
                        '150 |        });'
                    );
                });
        });

        it('Should fail when an unexpected confirmation dialog appears', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected confirm after redirect',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('Unexpected system confirm dialog with text "Confirm?" appeared.');
                    expect(errs[0]).contains('> 154 |    await t.click(\'#linkToConfirmPage\');')
                });
        });
    });

    describe('Dialogs appear during page loading', function () {
        it('Should pass if dialogs appear during page loading', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Dialogs appear during page loading');
        });

        it("Should fail if the expected prompt dialog doesn't appear during page loading", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected prompt during page loading',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('The expected system prompt dialog did not appear.');
                    expect(errs[0]).contains(
                        '> 170 |        .navigateTo(\'page-load.html\', { ' +
                        '171 |            handleDialogs: { ' +
                        '172 |                alert:   true, ' +
                        '173 |                confirm: {}, ' +
                        '174 |                prompt:  {} ' +
                        '175 |            }'
                    )
                });
        });

        it('Should fail when an unexpected alert dialog appears during page loading', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected alert during page loading',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('Unexpected system alert dialog with text "Alert!" appeared.');
                    expect(errs[0]).contains(
                        '> 181 |        .navigateTo(\'page-load.html\', { ' +
                        '182 |            handleDialogs: { ' +
                        '183 |                confirm: {}, ' +
                        '184 |                prompt:  {} ' +
                        '185 |            } ' +
                        '186 |        });'
                    );
                });
        });

        it('Should fail when an unexpected confirm dialog appears during page loading (test without navigateTo action)', function () {
            return runTests('./testcafe-fixtures/confirm-page-test.js', 'Unexpected confirm during page loading',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('Unexpected system confirm dialog with text "Confirm?" appeared.');
                    expect(errs[0]).contains('> 5 |    await t.click(\'body\');');
                });
        });
    });

    describe('Dialogs appear during waitForElement action', function () {
        it("Should pass if dialog appears during waitForElement action", function () {
            return runTests('./testcafe-fixtures/different-actions-test.js', 'Dialog appears during waitForElement action')
        });

        it("Should fail if the expected alert dialog doesn't appear during waitForElement action", function () {
            return runTests('./testcafe-fixtures/different-actions-test.js', 'No expected alert during waitForElement action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    expect(errs[0]).contains('The expected system alert dialog did not appear.');
                });
        });

        it('Should fail when an unexpected alert dialog appears during waitForElement action', function () {
            return runTests('./testcafe-fixtures/different-actions-test.js', 'Unexpected alert during waitForElement action',
                { shouldFail: true })
                .catch(function (errs) {
                    console.log(errs);
                    expect(errs[0]).contains('Unexpected system alert dialog with text "Alert!" appeared.');
                });
        });
    });

    describe('Dialogs appear during resizeWindow action', function () {
            it("Should pass if dialog appears during resizeWindow action", function () {
                return runTests('./testcafe-fixtures/different-actions-test.js', 'Dialog appears during resizeWindow action')
            });

            it("Should fail if the expected alert dialog doesn't appear during resizeWindow action", function () {
                return runTests('./testcafe-fixtures/different-actions-test.js', 'No expected alert during resizeWindow action',
                    { shouldFail: true })
                    .catch(function (errs) {
                        console.log(errs);
                        expect(errs[0]).contains('The expected system alert dialog did not appear.');
                    });
            });

            it('Should fail when an unexpected alert dialog appears during resizeWindow action', function () {
                return runTests('./testcafe-fixtures/different-actions-test.js', 'Unexpected alert during resizeWindow action',
                    { shouldFail: true })
                    .catch(function (errs) {
                        console.log(errs);
                        expect(errs[0]).contains('Unexpected system alert dialog with text "Alert!" appeared.');
                    });
            });
        });
});*/
