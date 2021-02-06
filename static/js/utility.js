/**
 * Returns all element descendants of node that match selectors.
 *
 * @param {String} selector - Query String selector for the element to be selected
 * @param {HTMLElement} [el=null] - The element to be searched, defaults to 'this'
 * @return {Array<HTMLElement>} All elements that match the selector
 */
const getAll = (selector, el = null) => {
    let parent = el;
    if (!el) {
        parent = document;
    }
    
    return Reflect.apply(Array.prototype.slice, parent.querySelectorAll(selector));
}

/**
 * Returns the first element that is a descendant of node that matches selectors.
 * @param {String} selector - Query String selector for the element to be selected
 * @param {HTMLElement} el - The element to be searched, defaults to 'this'
 * @return {HTMLElement} The first element that matches the selector
 */
const getFirst = (selector, el = null) => {
    let parent = el;
    if (!el) {
        parent = document;
    }

    return parent.querySelector(selector);
}


/**
 *  Template Literal Function that when passed a data object, will bind the objects key/value pairs with all matching keys in the template string (See example below)
 *  
 * ex. 
 * 
 * ```
 *  let myTemplate = template`` 
 *      I am a template string that says {'Blah'}
 *  ``;
 *  console.log(myTemplate({ Blah: 'Ooogie boogie'}));
 *  
 * ```
 * 
 * output:
 * `I am a template string that says Ooogie boogie` 
 *  
 * (For more information about Template Literals see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) 
 * 
 * @param {string[]} strings Array of strings that comprise the template string
 * @param {string[]} keys The keys of the template string to bind when calling the function
 * @return {Function} A function that will return a rendered template when passed an object with matching keys
 */
const template = (strings, ...keys) => {
    return (function(...values) {
        let dict = values[values.length - 1] || {};
        let result = [strings[0]];
        keys.forEach(function(key, i) {
        let value = Number.isInteger(key) ? values[key] : dict[key];
        result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}

export {
    getAll,
    getFirst,    
    template,
};