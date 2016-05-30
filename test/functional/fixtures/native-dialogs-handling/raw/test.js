var errorInEachBrowserContains = require('../../../assertion-helper.js').errorInEachBrowserContains;


describe('[RAW] Native dialogs handling', function () {
    it('Should pass if the expected confirm dialog appears after an action', function () {
        return runTests('./testcafe-fixtures/native-dialogs.testcafe', 'Expected confirm after an action',
            { shouldFail: true })
            .catch(function (errs) {
                console.log(errs);
                errorInEachBrowserContains(errs, 'Confirm dialog with result: true', 0);
            });
    });

    it("Should fail if the expected confirm dialog doesn't appear after an action", function () {
        return runTests('./testcafe-fixtures/native-dialogs.testcafe', 'No expected confirm after an action',
            { shouldFail: true })
            .catch(function (errs) {
                console.log(errs);
                errorInEachBrowserContains(errs, 'The expected system confirm dialog did not appear.', 0);
                errorInEachBrowserContains(errs, '[[No expected confirm after an action callsite]]', 0);
            });
    });

    it('Should fail when an unexpected confirm dialog appears after an action', function () {
        return runTests('./testcafe-fixtures/native-dialogs.testcafe', 'Unexpected confirm after an action',
            { shouldFail: true })
            .catch(function (errs) {
                console.log(errs);
                errorInEachBrowserContains(errs, 'Unexpected system confirm dialog with text "Confirm?" appeared.', 0);
                errorInEachBrowserContains(errs, '[[Unexpected confirm after an action callsite]]', 0);
            });
    });

    it('Should pass if the expected confirm dialog appears after page load', function () {
        return runTests('./testcafe-fixtures/page-load.testcafe', 'Expected confirm after page load',
            { shouldFail: true })
            .catch(function (errs) {
                console.log(errs);
                errorInEachBrowserContains(errs, 'Confirm dialog with result: true', 0);
            });
    });

    it("Should fail if the expected confirm dialog doesn't appear after page load", function () {
        return runTests('./testcafe-fixtures/native-dialogs.testcafe', 'No expected confirm after page load',
            { shouldFail: true })
            .catch(function (errs) {
                console.log(errs);
                errorInEachBrowserContains(errs, 'The expected system confirm dialog did not appear.', 0);
                errorInEachBrowserContains(errs, '[[No expected confirm after page load callsite]]', 0);
            });
    });

    it('Should fail when an unexpected confirm dialog appears after page load', function () {
        return runTests('./testcafe-fixtures/page-load.testcafe', 'Unexpected confirm after page load',
            { shouldFail: true })
            .catch(function (errs) {
                console.log(errs);
                errorInEachBrowserContains(errs, 'Unexpected system confirm dialog with text "Confirm?" appeared.', 0);
                errorInEachBrowserContains(errs, '[[Unexpected confirm after page load callsite]]', 0);
            });
    });
});
