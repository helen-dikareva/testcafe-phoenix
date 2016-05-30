var errorInEachBrowserContains = require('../../../assertion-helper.js').errorInEachBrowserContains;


describe('Native dialogs handling222', function () {
    it('Should pass if the expected confirm dialog appears after an action', function () {
        return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Expected confirm after an action');
    });

    it("Should fail if the expected confirm dialog doesn't appear after an action", function () {
        return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected confirm after an action',
            { shouldFail: true })
            .catch(function (errs) {
                console.log(errs);
                errorInEachBrowserContains(errs, 'The expected system confirm dialog did not appear.', 0);
                errorInEachBrowserContains(errs, ' > 36 |        .handleConfirm(true);', 0);
            });
    });

    it('Should fail when an unexpected confirm dialog appears after an action', function () {
        return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected confirm after an action',
            { shouldFail: true })
            .catch(function (errs) {
                console.log(errs);
                errorInEachBrowserContains(errs, 'Unexpected system confirm dialog with text "Confirm?" appeared.', 0);
                errorInEachBrowserContains(errs, '> 41 |        .click(\'#buttonConfirm\'); ', 0);
            });
    });

    it('Should pass if the expected confirm dialog appears after page load', function () {
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
    });
});

/*var expect = require('chai').expect;


describe('Native dialogs handling', function () {
    describe('Errors during dialogs handling', function () {
        it("Should fail if the expected alert dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected alert after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('The expected system alert dialog did not appear.');
                    expect(errs[0]).contains(
                        '> 12 |        .click(\'#withoutDialog\', { ' +
                        '13 |            handleDialogs: { alert: true } ' +
                        '14 |        });'
                    );
                });
        });

        it('Should fail when an unexpected alert dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected alert after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('Unexpected system alert dialog with text "Alert!" appeared.');
                    expect(errs[0]).contains('> 19 |        .click(\'#buttonAlert\');');
                });
        });

        it("Should fail if the expected confirm dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected confirm after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('The expected system confirm dialog did not appear.');
                    expect(errs[0]).contains(
                        '> 25 |        .click(\'#withoutDialog\', { ' +
                        '26 |            handleDialogs: { confirm: { result: true } } ' +
                        '27 |        });'
                    );
                });
        });

        it('Should fail when an unexpected confirm dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected confirm after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('Unexpected system confirm dialog with text "Confirm?" appeared.');
                    expect(errs[0]).contains('> 32 |        .click(\'#buttonConfirm\');');
                });
        });

        it("Should fail if the expected prompt dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected prompt after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('The expected system prompt dialog did not appear.');
                    expect(errs[0]).contains(
                        '> 38 |        .click(\'#withoutDialog\', { ' +
                        '39 |            handleDialogs: { ' +
                        '40 |                prompt: { result: \'text\' } ' +
                        '41 |            } ' +
                        '42 |        })'
                    );
                });
        });

        it('Should fail when an unexpected prompt dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected prompt after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('Unexpected system prompt dialog with text "Prompt:" appeared.');
                    expect(errs[0]).contains('> 47 |        .click(\'#buttonPrompt\');');
                });
        });

        it("Should fail if the expected beforeUnload dialog doesn't appear after an action", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'No expected beforeUnload after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('The expected system beforeUnload dialog did not appear.');
                    expect(errs[0]).contains(
                        '> 200 |        .click(\'#linkToThisPage\', { ' +
                        '201 |            handleDialogs: { beforeUnload: true } ' +
                        '202 |        });'
                    );
                });
        });

        it('Should fail when an unexpected beforeUnload dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected beforeUnload after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('Unexpected system beforeUnload dialog with text "Before unload" appeared.');
                    expect(errs[0]).contains('> 208 |        .click(\'#linkToThisPage\'); ');
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
                    expect(errs[0]).contains('The expected system prompt dialog did not appear.');
                    expect(errs[0]).contains(
                        '> 64 |        .click(\'#buttonDialogsSequence\', { ' +
                        '65 |            handleDialogs: { ' +
                        '66 |                confirm: { result: true }, ' +
                        '67 |                alert:   true, ' +
                        '68 |                prompt:  { result: null } ' +
                        '69 |            }'
                    );
                });
        });

        it('Should fail when an unexpected confirm dialog appears after an action', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Unexpected confirm in dialogs sequence after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('Unexpected system confirm dialog with text "Confirm?" appeared.');
                    expect(errs[0]).contains(
                        '> 75 |        .click(\'#buttonDialogsSequence\', { ' +
                        '76 |            handleDialogs: { alert: true } ' +
                        '77 |        });'
                    );
                });
        });
    });

    describe('Dialog appears after timeout', function () {
        it("Should pass if the timeout for waiting dialog exceeds time required for the dialogs to appear", function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Dialog alert appears with some timeout after an action',
                { elementAvailabilityTimeout: 1500 });
        });

        it('Should fail if the timeout for waiting dialog is less than time required for the dialog to appear', function () {
            return runTests('./testcafe-fixtures/native-dialogs-test.js', 'Dialog alert appears with some timeout after an action',
                { shouldFail: true })
                .catch(function (errs) {
                    expect(errs[0]).contains('The expected system alert dialog did not appear.');
                    expect(errs[0]).contains(
                        '> 83 |        .click(\'#buttonDialogAfterTimeout\', { ' +
                        '84 |            handleDialogs: { alert: true } ' +
                        '85 |        });'
                    );
                });
        });
    });

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

            it.only("Should fail if the expected alert dialog doesn't appear during resizeWindow action", function () {
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
