type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTION';

export default class Ajax {

    /** 
    * Executes an asynchronous javascript request, returning a promise that resolves with the request
    * 
    * @param {string} url - The url of the resource to make the request for (Required)
    * @param {object} requestBody - Object to be included as the request body of the request (Not applicable for GET requests) (Optional)
    * @param {function} success - function to execute upon success (Optional)
    * @param {function} failure - function to execute upon failure (Optional)
    * @param {HttpMethod} method - The HTTP method to use for the request (Default: GET)
    * @return {Promise} A promise that resolves the http request
    */
    static _request(
        url: string, 
        requestBody: object = null, 
        success: Function = null, 
        failure: Function = null,
        method: HttpMethod = 'GET'
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const XHR: XMLHttpRequest = new XMLHttpRequest(),
                handleErrors = (errorMsg: string, status: string | number) => {
                    if (failure) {
                        failure(errorMsg, status);
                    }
                    if (reject) {
                        reject({ errorMsg, status });
                    }
                };
            try {
                if (!XHR) {
                    let errorMsg = 'Cannot create an XMLHTTP instance';
                    if (failure) {
                        failure(errorMsg);
                    }
                    if (reject) {
                        reject(errorMsg);
                    }
                    return;
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
                                response = JSON.parse(XHR.responseText);
                                if (success) {
                                    success(response, status);
                                }
                                if (resolve) {
                                    resolve({ response, status });
                                }
                            }
                        } else {
                            // Oh no! There has been an error with the request!
                            let errorMsg = `An error occurred with the request to "${url}" Status Code: ${status.toString()}`;
                            handleErrors(errorMsg, status);
                        }
                    }
                };
                XHR.setRequestHeader('Content-Type', 'application/json');
                let requestString = '';
                if (requestBody && method !== 'GET') {
                    requestString = JSON.stringify(requestBody);
                }
                XHR.send(requestString);
            } catch (error) {
                handleErrors(error.message, status);
            }
        });
    }

    /** 
    * Executes an asynchronous javascript GET request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @return {Promise} A promise that resolves the http request
    */
    static get = (url: string, success: Function = null, failure: Function = null): Promise<any> =>
        Ajax._request(url, null, success, failure);
    /** 
    * Executes an asynchronous javascript POST request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Object} requestBody - Object to be included as the request body of the request (Optional)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @return {Promise} A promise that resolves the http request
    */
    static post = (url: string, requestBody: object = null, success: Function = null, failure: Function = null): Promise<any> =>
        Ajax._request(url, requestBody, success, failure, 'POST');
    /** 
    * Executes an asynchronous javascript PUT request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Object} requestBody - Object to be included as the request body of the request (Optional)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @return {Promise} A promise that resolves the http request
    */
    static put = (url: string, requestBody: object = null, success: Function = null, failure: Function = null): Promise<any> =>
        Ajax._request(url, requestBody, success, failure, 'PUT');
    /** 
    * Executes an asynchronous javascript DELETE request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Object} requestBody - Object to be included as the request body of the request (Optional)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @return {Promise} A promise that resolves the http request
    */
    static remove = (url: string, requestBody: object = null, success: Function = null, failure: Function = null): Promise<any> =>
        Ajax._request(url, requestBody, success, failure, 'DELETE');
    /** 
    * Executes an asynchronous javascript OPTION request, returning a promise that resolves with the request
    * @param {String} url - The url of the resource to make the request for (Required)
    * @param {Object} requestBody - Object to be included as the request body of the request (Optional)
    * @param {Function} success - function to execute upon success (Optional)
    * @param {Function} failure - function to execute upon failure (Optional)
    * @return {Promise} A promise that resolves the http request
    */
    static option = (url: string, requestBody: object = null, success: Function = null, failure: Function = null): Promise<any> =>
        Ajax._request(url, requestBody, success, failure, 'OPTION');
}