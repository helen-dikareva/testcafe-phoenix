fixture `A set of examples that illustrate how to use TestCafe API`
    .page `http://localhost/testcafe/`;

// Tests
test('Text typing basics', async t => {
    await t.click('body');
});
