import HttpHandler from "@/api/HttpHandler";

const http: HttpHandler = new HttpHandler();

// 单次出拳用户设置
interface Choose {
    turn: Number,
    player: "player1" | "player2" | string
    choose: "scissors" | "stone" | "cloth" | "no"
}

// 获取其他用户出拳设置
interface ChooseBoth {
    turn: Number
    player1: "scissors" | "stone" | "cloth" | "no"
    player2: "scissors" | "stone" | "cloth" | "no"
}

export default class pendingBillingApi {

    constructor() {
    }

    sendChoose(params: Choose) {
        let url = '/api/finger/send';
        return http.post(url, params);
    }

    getChoose() {
        let url = '/api/finger/get';
        return http.get(url);
    }
}