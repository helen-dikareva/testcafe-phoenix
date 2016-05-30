import { Hybrid } from 'testcafe';
import { expect } from 'chai';

fixture `Confirm page`
    .page `http://localhost:3000/native-dialogs-handling/es-next/pages/confirm.html`;


const getResult = Hybrid(() => document.getElementById('result').textContent);


test('Unexpected confirm after page load', async t => {
    await t.click('body');
});

test('Expected confirm after page load', async t => {
    await t
        .handleConfirm(true)
        .click('body');

    expect(await getResult()).equals('true');
});
