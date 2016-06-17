// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
export const TYPE = {
    beforeUnload: 'beforeunload',
    alert:        'alert',
    confirm:      'confirm',
    prompt:       'prompt'
};

export class ExpectedDialog {
    constructor (type, result) {
        this.type   = type;
        this.result = result;
    }
}

export class AppearedDialog {
    constructor (type, text) {
        this.type = type;
        this.text = text;
    }
}

