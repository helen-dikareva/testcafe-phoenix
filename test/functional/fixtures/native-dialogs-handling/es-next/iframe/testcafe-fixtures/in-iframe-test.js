import { ClientFunction, Selector } from 'testcafe';
import { expect } from 'chai';

fixture `Native dialogs in iframe`
    .page `http://localhost:3000/fixtures/native-dialogs-handling/es-next/iframe/pages/page-with-iframe.html`;

const WAIT_FOR_DIALOG_TIMEOUT = 200;


//Actions in iframe, dialogs in iframe
test('Expected alert in iframe after an action in iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .click('#buttonAlert')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('No expected alert after an action in iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .click('#withoutDialog')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected alert in iframe after an action in iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .click('#buttonAlert');
});

//Actions in top window, dialogs in iframe
test('Expected alert in iframe after an action in top window', async t => {
    await t
        .click('#buttonIframeAlert')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected alert in iframe after an action in top window', async t => {
    await t
        .click('#buttonIframeAlert');
});

//Actions in iframe, dialogs in top window
test('Expected alert in top window after an action in iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .click('#buttonTopWindowAlert')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected alert in top window after an action in iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .click('#buttonTopWindowAlert');
});

//Actions in child iframe, dialogs in parent iframe
test('Expected alert in parent iframe after an action in child iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .switchToIframe('#childIframe')
        .click('#buttonParentIframeAlert')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('No expected alert in parent iframe after an action in child iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .switchToIframe('#childIframe')
        .click('#withoutDialog')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected alert in parent iframe after an action in child iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .switchToIframe('#childIframe')
        .click('#buttonParentIframeAlert');
});

//Actions in parent iframe, dialogs in child iframe
test('Expected alert in child iframe after an action in parent iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .click('#buttonChildIframeAlert')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('No expected alert in child iframe after an action in parent iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .click('#withoutDialog')
        .handleAlert({ timeout: WAIT_FOR_DIALOG_TIMEOUT });
});

test('Unexpected alert in child iframe after an action in parent iframe', async t => {
    await t
        .switchToIframe('#iframe')
        .click('#buttonChildIframeAlert');
});

