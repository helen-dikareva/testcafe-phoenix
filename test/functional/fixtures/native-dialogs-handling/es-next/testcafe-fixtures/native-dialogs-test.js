import { ClientFunction } from 'testcafe';
import { expect } from 'chai';

fixture `Native dialogs`
    .page `http://localhost:3000/native-dialogs-handling/es-next/pages/index.html`;

const getResult = ClientFunction(() => document.getElementById('result').textContent);

// Alert
test('No expected alert after an action', async t => {
    await t
        .click('#withoutDialog')
        .handleAlert();
});

test('Unexpected alert after an action', async t => {
    await t
        .click('#buttonAlert');
});

//Confirm
test('No expected confirm after an action', async t => {
    await t
        .click('#withoutDialog')
        .handleConfirm(true);
});

test('Unexpected confirm after an action', async t => {
    await t
        .click('#buttonConfirm');
});

//Prompt
test('No expected prompt after an action', async t => {
    await t
        .click('#withoutDialog')
        .handlePrompt('text');
});

test('Unexpected prompt after an action', async t => {
    await t
        .click('#buttonPrompt');
});

//BeforeUnload
test('No expected beforeUnload after an action', async t => {
    await t
        .click('#linkToThisPage')
        .handleBeforeUnload();
});

test('Unexpected beforeUnload after an action', async t => {
    await t
        .click('#enableBeforeUnload')
        .click('#linkToThisPage');
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
        .handleAlert()
        .handleConfirm(true)
        .handlePrompt(null);
});

test('Unexpected confirm in dialogs sequence after an action', async t => {
    await t
        .click('#buttonDialogsSequence')
        .handleAlert()
        .handlePrompt();
});

//Page load
test('No expected confirm after page load', async t => {
    await t
        .handleConfirm(true)
        .click('#withoutDialog');
});

//Timeout after action
test('Dialog alert appears with some timeout after redirect', async t => {
    await t
        .click('#buttonDialogAfterTimeoutWithRedirect')
        .handleAlert();
});

test('Dialog alert appears with some timeout after an action', async t => {
    await t
        .click('#buttonDialogAfterTimeout')
        .handleAlert();
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
        .handleConfirm(true);
});

test('Unexpected confirm after redirect', async t => {
    await t.click('#linkToConfirmPage');
});

//Dialog during page loading
/*test('Dialogs appear during page loading', async t => {
    await t
        .navigateTo('page-load.html', {
            handleDialogs: {
                alert:   true,
                confirm: {}
            }
        });
});

test('No expected prompt during page loading', async t => {
    await t
        .navigateTo('page-load.html', {
            handleDialogs: {
                alert:   true,
                confirm: {},
                prompt:  {}
            }
        });
});

test('Unexpected alert during page loading', async t => {
    await t
        .navigateTo('page-load.html', {
            handleDialogs: {
                confirm: {},
                prompt:  {}
            }
        });
});

//BeforeUnload dialog
test('Dialogs beforeUnload appears after an action', async t => {
    await t
        .click('#enableBeforeUnload')
        .click('#linkToThisPage', {
            handleDialogs: { beforeUnload: true }
        });
});
*/


/*
test("Handle dialog before page load", async t => {
    await t
        .handleAlert(dialogText)
        .click('#button1');
});

test('Dialog and wait action/wait for element action?', async t => {
    await t
        .click('#button1')
        .wait()
        .handleAlert();
});

*/
