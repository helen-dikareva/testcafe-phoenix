//HACK: waiting for the https://github.com/superroma/testcafe-hammerhead/issues/78 issue fixed
window.Hammerhead.Util.Types = {
    isDocument: function (instance) {
        if (instance instanceof window.Hammerhead.NativeMethods.documentClass)
            return true;

        return instance && typeof instance === 'object' && typeof instance.referrer !== 'undefined' &&
               instance.toString &&
               (instance.toString() === '[object HTMLDocument]' || instance.toString() === '[object Document]');
    }
};

export default window.Hammerhead;
