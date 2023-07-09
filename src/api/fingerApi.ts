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
    id: string
}
export type TablelistType = Array<TableType>
export type FingerType = "scissors" | "stone" | "cloth" | null 
export type UserStateType = "wait" | "choosed" | "ready"           
export interface Choose {
    turn: number
    role: "player1" | "player2" | "viewer"                   
    choose: FingerType
}
export interface FingerDataType {
    player1: {
        name: String,
        choose: FingerType,
        state: UserStateType,
        turn: number
        id: String
    }
    player2: {
        name: String,
        choose: FingerType,
        state: UserStateType,
        turn: Number
        id: String
    }
}
// Api
export class fingerApi {
    constructor() {
    }
    sendHeartbeat(params:{userId:string}) {
        let url = '/api/heartbeat';
        return http.post(url, params);
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
    leaveTable(params: { id:string }) {
        let url = '/api/finger/leave-table';
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