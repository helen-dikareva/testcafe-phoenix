import { createContext, runInContext, Script, runInNewContext } from 'vm';
import SelectorBuilder from '../client-functions/selectors/selector-builder';
import ClientFunctionBuilder from '../client-functions/client-function-builder';

export class CodeExecutor {
    constructor () {
        this.testRun             = null;
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

    execute (code, skipVisibilityCheck, testRun) {
        this.testRun             = testRun || null;
        this.skipVisibilityCheck = skipVisibilityCheck;

        return runInNewContext(code, this.context, { displayErrors: false });
    }
}

let codeExecutor = null;

export function createNewExecutor () {
    debugger;
    codeExecutor = new CodeExecutor();
}

export function execute (code, skipVisibilityCheck, testRun) {
    return codeExecutor.execute(code, skipVisibilityCheck, testRun);
}


