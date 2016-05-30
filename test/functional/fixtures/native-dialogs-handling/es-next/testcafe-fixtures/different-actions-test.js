import { Hybrid } from 'testcafe';
import { expect } from 'chai';

const getWindowWidth  = Hybrid(() => window.innerWidth);
const getWindowHeight = Hybrid(() => window.innerHeight);
const iPhoneSize      = { width: 480, height: 320 };

var initialWindowWidth  = null;
var initialWindowHeight = null;

fixture `Native dialogs after different actions`
    .page `http://localhost:3000/native-dialogs-handling/es-next/pages/different-actions.html`
    .beforeEach(async () => {
        initialWindowWidth  = await getWindowWidth();
        initialWindowHeight = await getWindowHeight();
    })
    .afterEach(async t => {
        await t
            .resizeWindow(initialWindowWidth, initialWindowHeight);
    });

//waitForElement
test('Dialog appears during waitForElement action', async t => {
    await t
        .click('#withDialog')
        .waitForElement('#button', 2000, {
            handleDialogs: { alert: true }
        });
});

test('No expected alert during waitForElement action', async t => {
    await t
        .click('#withoutDialog')
        .waitForElement('#button', 2000, {
            handleDialogs: { alert: true }
        });
});

test('Unexpected alert during waitForElement action', async t => {
    await t
        .click('#withDialog')
        .waitForElement('#button', 2000);
});


//resizeWindow
test('Dialog appears during resizeWindow action', async t => {
    await t.resizeWindow(480, 320, {
        handleDialogs: { alert: true }
    });
});

test('No expected alert during resizeWindow action', async t => {
    await t
        .resizeWindow(500, 500, {
            handleDialogs: { alert: true }
        });
});

test('Unexpected alert during resizeWindow action', async t => {
    await t
        .resizeWindow(480, 320);
});
