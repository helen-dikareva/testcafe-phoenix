'@fixture navigateTo';
'@page ./tests/runner/api/navigate-to/index.html';

'@test'['Navigate to given url'] = {
    '1.Navigate to url': function () {
        this.pageHref = 'http://localhost:3000/tests/runner/api/click/index.html';

        act.navigateTo(this.pageHref);
    },

    '2.Check changed location': function () {
        ok(window.location.href.indexOf(this.pageHref) > -1, 'page location changed');
    }
};
