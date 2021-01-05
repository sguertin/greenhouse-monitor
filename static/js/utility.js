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


export {
    getAll,
    getFirst,    
};