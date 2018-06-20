import { createContext, runInContext, Script, runInNewContext } from 'vm';
import SelectorBuilder from '../client-functions/selectors/selector-builder';
import ClientFunctionBuilder from '../client-functions/client-function-builder';

export default class CodeExecutor {
    constructor (testRun) {
        this.testRun             = testRun;
        this.skipVisibilityCheck = false;

        this.context = this.createContext();
    }

    createContext () {
        const sandbox = {
            Selector: (fn, options = {}) => {
                if (this.skipVisibilityCheck)
                    options.visibilityCheck = false;

                if (this.testRun)
                    options.boundTestRun = this.testRun;

                const builder = new SelectorBuilder(fn, options, { instantiation: 'Selector' });

                return builder.getFunction();
            },

            ClientFunction: (fn, options = {}) => {
                if (this.testRun)
                    options.boundTestRun = this.testRun;

                var builder = new ClientFunctionBuilder(fn, options, { instantiation: 'ClientFunction' });

                return builder.getFunction();
            }
        };

        return createContext(sandbox);
    }

    execute (code, skipVisibilityCheck) {
        this.skipVisibilityCheck = skipVisibilityCheck;

        return runInNewContext(code, this.context, { displayErrors: false });
    }

}
