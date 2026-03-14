const API_IP = 'http://localhost';//Lines 1 and 2 define constants for the API server's IP and PORT
const API_PORT = 9000;

const headers = {//Lines 4 to 11 define a basic header to add to requests
    // https://www.rfc-editor.org/rfc/rfc7231#section-5.3.2
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
    'Accept': '*/*',
    // https://www.rfc-editor.org/rfc/rfc7231#section-3.1.1.5
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
    'Content-Type': 'application/json'
}
//Line 13 defines a function that builds the URL of the endpoint given a route 
const serverRoute = (route) => `${API_IP}:${API_PORT}/${route}`;

const profile = {
    async saveUser(user){
        let response = await fetch(serverRoute(`users/${user}`), {
            headers,
            method: 'POST'
        });
        return response;
    },
    //TODO: Server team, implement client side route
    // async getUser(id){
    //     let response = await fetch(serverRoute(`user/${id}`), {
    //         headers,
    //         method: 'GET'
    //     });
    //     return response;
    // }
}

export {
    profile
}