import HttpHandler from "@/api/HttpHandler";

const http: HttpHandler = new HttpHandler();

export default class pendingBillingApi {

    constructor() {
    }


    findSettleList(params?: object) {
        let url = '/api/get';
        return http.get(url, params);
    }
    addSettle(params: object) {
        let url = '/api/post';
        return http.post(url, params);
    }
}

