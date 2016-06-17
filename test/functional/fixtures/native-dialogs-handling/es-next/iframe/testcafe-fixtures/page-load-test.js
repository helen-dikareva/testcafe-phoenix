import { expect } from 'chai';

fixture `Page load`
    .page `http://localhost:3000/fixtures/native-dialogs-handling/es-next/iframe/pages/page-load.html`;

test('Expected dialogs after page load', async t => {
    await t
        .handleAlert()
        .handleAlert()
        .handleConfirm(true);
});

test('Unexpected alert after page load', async t => {
    await t.click('body');
});
