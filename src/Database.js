const API_URL = "http://wteapiapp.azurewebsites.net/items";
function fetchAPI(method, body) {
    if (method === "GET") {
        return fetch(API_URL).then(body => body.json());
    } else {
        return fetch(API_URL, {
            body: JSON.stringify(body),
            method: method,
            headers: {
                "content-type": "application/json"
            }
        }).then(res => res.json());
    }
}
export function getItems() {
    return fetchAPI("GET");
}
export function addItem(name, weight) {
    return fetchAPI("POST", { name, weight });
}
export function deleteItem(name) {
    return fetchAPI("DELETE", { name });
}
