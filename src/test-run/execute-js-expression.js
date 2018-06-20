import { createContext, runInContext, Script, runInNewContext} from 'vm';

export function executeJsExpression (expression, context) {
    return runInNewContext(expression, context, { displayErrors: false });
}
