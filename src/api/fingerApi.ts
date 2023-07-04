import HttpHandler from "@/api/HttpHandler";

const http: HttpHandler = new HttpHandler();

// 单次出拳用户设置
export type fingertype = "scissors" | "stone" | "cloth" | "ready" | "wait"

export interface Choose {
    turn: Number,
    player: "player1" | "player2" | undefined
    choose: fingertype
}

// 获取其他用户出拳设置
export interface ChooseBoth {
    turn: Number
    player1: fingertype
    player2: fingertype
}

export class fingerApi {

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