import HttpHandler from "@/api/HttpHandler";
const http: HttpHandler = new HttpHandler();

// 定义数据结构
export type TableType = {
    index: String
    player1: String | null
    player2: String | null
    Viewer: Array<String>
}
export type EnterUserType = {
    tableIndex: number
    userName: String
    role: "player1" | "player2" | "viewer"
}
export type TablelistType = Array<TableType>
export type FingerType = "scissors" | "stone" | "cloth" | null // 出拳类型分成剪刀石头和布
export type UserStateType = "wait" | "choosed" | "ready"           // 用户状态分为等待，已选择，准备下一局
export interface Choose {
    turn: Number
    player: "player1" | "player2" | "viewer"                   // viewer 是观众
    choose: FingerType
    state: UserStateType
}
export interface FingerData {
    turn: Number
    player1: {
        choose: FingerType,
        state: UserStateType
    }
    player2: {
        choose: FingerType,
        state: UserStateType
    }
}

// Api
export class fingerApi {
    constructor() {
    }
    getTableList() {
        let url = '/api/finger/get-table-list';
        return http.get(url);
    }
    enterTable(params: EnterUserType) {
        let url = '/api/finger/enter-table';
        return http.post(url, params);
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