import { ClientFunction, Selector } from 'testcafe';
import { expect } from 'chai';

fixture `Native dialogs`
    .page `http://localhost:3000/fixtures/native-dialogs-handling/es-next/pages/index.html`;

const WAIT_FOR_DIALOG_TIMEOUT = 200;
const getResult               = ClientFunction(() => document.getElementById('result').textContent);

// Alert
test('No expected alert after an action', async t => {
    await t
        .click('#withoutDialog')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected alert after an action', async t => {
    await t
        .click('#buttonAlert');
});

//BeforeUnload
test('No expected beforeUnload after an action', async t => {
    await t
        .click('#linkToThisPage')
        .handleBeforeUnload({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected beforeUnload after an action', async t => {
    await t
        .click('#enableBeforeUnload')
        .click('#linkToThisPage');
});

test('Unexpected dialog and another execution error', async t => {
    await ClientFunction(() => window.setTimeout(() => {
        /* eslint-disable no-alert*/
        window.alert('Alert!');
        /* eslint-enable no-alert*/
    }, 200))();
    await t.click('#non-existent');
});

//Dialog sequence
test('Dialogs sequence appears after an action', async t => {
    await t
        .click('#enableBeforeUnload')
        .click('#buttonAllDialogsSequence')
        .handleAlert()
        .handleAlert()
        .handleConfirm(true)
        .handleConfirm(false)
        .handlePrompt('text')
        .handlePrompt(null)
        .handleBeforeUnload();
});

test('No expected prompt in dialogs sequence after an action', async t => {
    await t
        .click('#buttonAlertConfirm')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT })
        .handleConfirm(true, { timeout: WAIT_FOR_DIALOG_TIMEOUT })
        .handlePrompt(null, { timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected confirm in dialogs sequence after an action', async t => {
    await t
        .click('#buttonAlertConfirmPrompt')
        .handleAlert()
        .handlePrompt();
});

//Timeout after action
test('Dialog alert appears with some timeout after redirect', async t => {
    await t
        .click('#buttonDialogAfterTimeoutWithRedirect')
        .handleAlert({ timeout: 1500 });
});

test('Dialog alert appears with some timeout after an action', async t => {
    await t
        .click('#buttonDialogAfterTimeout')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected dialog appear during waiting for dialog', async t => {
    await t
        .click('#buttonDialogAfterTimeout')
        .handleConfirm(false, { timeout: 1500 });
});

// Dialogs after page redirect
test('Expected alert and confirm after redirect', async t => {
    await t
        .click('#buttonRedirectConfirm')
        .handleAlert()
        .handleConfirm(true);

    expect(await getResult()).equals('true');

    await t.navigateTo('index.html');

    await t.click('#buttonRedirectConfirm')
        .handleAlert()
        .handleConfirm(false);

    expect(await getResult()).equals('false');
});

test('Expected alert and prompt after redirect', async t => {
    await t
        .click('#buttonRedirectPrompt')
        .handleAlert()
        .handlePrompt('prompt result');

    expect(await getResult()).equals('prompt result');

    await t.navigateTo('index.html');

    await t.click('#buttonRedirectPrompt')
        .handleAlert()
        .handlePrompt(null);

    expect(await getResult()).equals('null');
});

test('No expected confirm after redirect', async t => {
    await t
        .click('#linkToThisPage')
        .handleConfirm(true, { timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected confirm after redirect', async t => {
    await t.click('#linkToConfirmPage');
});

//Dialog after page load
test('No expected confirm after page load', async t => {
    await t
        .handleConfirm(true, { timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

//NavigateTo
test('Dialog appears during navigateTo action', async t => {
    await t.navigateTo('page-load.html')
        .handleAlert()
        .handleConfirm();
});

test('No expected alert during navigateTo action', async t => {
    await t
        .navigateTo('index.html')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT })
        .handleConfirm(false, { timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected confirm during navigateTo action', async t => {
    await t.navigateTo('page-load.html')
        .handleAlert();
});

//Dialogs during wait command execution
test('Expected alert during a wait action', async t => {
    await t
        .click('#buttonDialogAfterTimeout')
        .wait(2000)
        .handleAlert();
});

test('No expected alert during a wait action', async t => {
    await t
        .click('#buttonDialogAfterTimeout')
        .wait(10)
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected alert during a wait action', async t => {
    await t
        .click('#buttonDialogAfterTimeout')
        .wait(2000);
});

//Not chained handle command
test('Handle dialog command is not chained to action causing alert', async t => {
    await t.click('#buttonAlert');
    await t.handleAlert();
});

test('Handle dialog command is not chained to action', async t => {
    await t.click('#withoutDialog');
    await t.handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

//Dialog after a client function
test('Alert during execution of a client function', async t => {
    /* eslint-disable no-alert*/
    await ClientFunction(() => alert('Alert!'))();
    /* eslint-enable no-alert*/
    await t.handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Alert during execution of a selector', async t => {
    await Selector(() => {
        /* eslint-disable no-alert*/
        alert('Alert!');
        /* eslint-enable no-alert*/
        return document.body;
    })();
    await t.handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});
