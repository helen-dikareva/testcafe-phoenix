import { Selector, ClientFunction } from 'testcafe';

fixture `f`
    .page `http://localhost/testcafe`;

test('t', async t => {
    var el = Selector('#hidden-input');
    var cf = ClientFunction(() => {
        debugger;
        var check1 = el().offsetParent;
    }, {
        dependencies: {
            el: el
        }
    });


    var check2 = await cf();
    await t
        .debug()
        .expect(el.offsetWidth).ok();
});
