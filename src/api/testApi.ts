import HttpHandler from "@/api/HttpHandler";

const http: HttpHandler = new HttpHandler();

export default class testApi {

    constructor() {
    }

    testGet(params?: object) {
        let url = '/api/get';
        return http.get(url, params);
    }
    testPost(params: object) {
        let url = '/api/post';
        return http.post(url, params);
    }
}

