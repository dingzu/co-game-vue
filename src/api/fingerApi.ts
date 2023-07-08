import HttpHandler from "@/api/HttpHandler";
const http: HttpHandler = new HttpHandler();

// 定义数据结构
export type TableType = {
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
export type FingerType = "scissors" | "stone" | "cloth" | null 
export type UserStateType = "wait" | "choosed" | "ready"           
export interface Choose {
    turn: Number
    player: "player1" | "player2" | "viewer"                   
    choose: FingerType
    state: UserStateType
}
export interface FingerDataType {
    player1: {
        name: String,
        choose: FingerType,
        state: UserStateType,
        turn: Number
    }
    player2: {
        name: String,
        choose: FingerType,
        state: UserStateType,
        turn: Number
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
    getDetail(params:{index:number}) {
        let url = '/api/finger/get-detail';
        return http.post(url, params);
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