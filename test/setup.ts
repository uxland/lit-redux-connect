//const mutationObserver = require('mutation-observer');
const  renameProperty = (a, b) => a;
Object.assign(global, {
    JSCompiler_renameProperty: renameProperty,
   //MutationObserver: mutationObserver
});