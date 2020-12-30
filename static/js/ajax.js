export default class Ajax {    
    /** 
    * Executes an asynchronous javascript request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Object} requestBody - Object to be included as the request body of the request (Not applicable for GET requests) (Optional)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @param {String} method - The HTTP method to use for the request (Default: GET)
    * @return {Promise} A promise that resolves the http request
    */    
    static #request(
        url,
        requestBody = null,
        success = null,
        failure = null,
        method = 'GET'
    ) {
        return new Promise((resolve, reject) => {
            const XHR = new XMLHttpRequest();
            if (!XHR) {
                const errorMsg = 'Cannot create an XMLHTTP instance';
                if (failure) {
                    failure(errorMsg);
                }
                if (reject) {
                    reject(errorMsg);
                }
                return;
            }
            let handleErrors = (errorMsg, status) => {
                if (failure) {
                    failure(errorMsg, status);
                }
                if (reject) {
                    reject({errorMsg, status});
                }
            }
            XHR.open(method, url);
            //Send the proper header information along with the request
            XHR.onreadystatechange = () => {
                // In local files, status is 0 upon success in Mozilla Firefox
                if (XHR.readyState === XMLHttpRequest.DONE) {
                    let status = XHR.status;
                    
                    if (status === 0 || (status >= 200 && status < 400)) {
                        // The request has been completed successfully
                        let response = null;
                        if (XHR.responseText) {
                            try {
                                response = JSON.parse(XHR.responseText);
                                if (success) {
                                    success(response, status);
                                }
                                if (resolve) {
                                    resolve({response, status});
                                }
                            } catch (error) {
                                handleErrors(error.message, status);
                            }                            
                        }                        
                    } else {
                        // Oh no! There has been an error with the request!
                        const errorMsg = `An error occurred with the request to "${url}" Status Code: ${status.toString()}`;
                        handleErrors(errorMsg, status);
                    }
                }
            };
            XHR.setRequestHeader('Content-Type', 'application/json');
            if (requestBody && method !== 'GET') {
                requestBody = JSON.stringify(requestBody);
            }
            XHR.send(requestBody);
        });
    }

    /** 
    * Executes an asynchronous javascript GET request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @return {Promise} A promise that resolves the http request
    */
    static get = (url, success = null, failure = null) =>
        Ajax.#request(url, null, success, failure);
    /** 
    * Executes an asynchronous javascript POST request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Object} requestBody - Object to be included as the request body of the request (Optional)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @return {Promise} A promise that resolves the http request
    */
    static post = (url, requestBody = null, success = null, failure = null) =>
        Ajax.#request(url, requestBody, success, failure, 'POST');
    /** 
    * Executes an asynchronous javascript PUT request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Object} requestBody - Object to be included as the request body of the request (Optional)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @return {Promise} A promise that resolves the http request
    */
    static put = (url, requestBody = null, success = null, failure = null) =>
        Ajax.#request(url, requestBody, success, failure, 'PUT');
    /** 
    * Executes an asynchronous javascript DELETE request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Object} requestBody - Object to be included as the request body of the request (Optional)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @return {Promise} A promise that resolves the http request
    */    
    static remove = (url, requestBody = null, success = null, failure = null) =>
        Ajax.#request(url, requestBody, success, failure, 'DELETE');
    /** 
    * Executes an asynchronous javascript OPTION request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Object} requestBody - Object to be included as the request body of the request (Optional)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @return {Promise} A promise that resolves the http request
    */    
    static option = (url, requestBody = null, success = null, failure = null) =>
        Ajax.#request(url, requestBody, success, failure, 'OPTION');
}
/*
export default class AjaxStore {
    /// TODO: Implement cacheing to layer over default Ajax implementation
}*/
