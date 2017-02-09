import { PomeloCmd, PomeloParamsKey, ParamBuilder_Inroom, NetworkConfig, ResponsePomelo } from './network-config';
import { UserDevice } from './config';

export enum SocketState {
    NONE = -1, CONNECTING, OPEN, CLOSING, CLOSED
}

export enum PomeloState {
    DISCONNECTED,
    INITING_SOCKET,
    INITED_SOCKET,
    CONNECTING_TO_GATE,
    CONNECTED_TO_GATE,
    CONNECTING_TO_CONNECTOR,
    CONNECTED_TO_CONNECTOR,
    LOGINING,
    LOGINED,
    REGISTERING,
    REGISTERED,
    ROOM_JOINING,
    ROOM_JOINED
}

export class PomeloService {
    public mPomeloState = PomeloState.DISCONNECTED;
    public mResponses = [];
    mConnectorHost = "";
    mConnectorPort = "";
    mPomeloDebug: boolean = false;
    mDevice: UserDevice;
    constructor() { }

    log(message: string) {
        if (this.mPomeloDebug) {
            console.log("pomelo-service, " + message);
        }
    }


    setUserDevice(device: UserDevice) {
        this.mDevice = device;
    }
    onLoggedOut() {
        this.mPomeloState = PomeloState.DISCONNECTED;
        this.disconnect();
    }
    clearResponses() {
        this.mResponses = [];
    }
    onExistConnector(data) {
        this.mConnectorHost = data.host;
        this.mConnectorPort = data.port;
    }
    onNotExistConnector() {
        this.mConnectorHost = "";
        this.mConnectorPort = "";
    }
    hasConnectorAddress() {
        return this.mConnectorHost != "";
    }
    getSocketState() {
        return window['pomelo'].getSocketState();
    }
    isSocketClosed() {
        let socketState = this.getSocketState();
        return socketState == SocketState.NONE || socketState == SocketState.CLOSED;
    }

    mManualDisconnect: boolean = false;
    public checkConnectoConnector(username: string, success, error) {
        if (!this.mManualDisconnect && this.isSocketClosed()) {
            this.mManualDisconnect = false;
            this.mPomeloState = PomeloState.DISCONNECTED;
        }

        if (this.mPomeloState == PomeloState.DISCONNECTED) {
            this.log("Kết nối tới socket");
            if (this.hasConnectorAddress()) {
                this.log("Connect tới connector được cấp");
                this.mPomeloState = PomeloState.CONNECTING_TO_CONNECTOR;
                window['pomelo'].init({
                    host: this.mConnectorHost, port: this.mConnectorPort
                }, (message) => {
                    this.mPomeloState = PomeloState.CONNECTED_TO_CONNECTOR;
                    this.checkConnectoConnector(username, success, error);
                });
            } else {
                this.mPomeloState = PomeloState.INITING_SOCKET;
                window['pomelo'].init({
                    host: NetworkConfig.MAIN_HOST, port: NetworkConfig.MAIN_PORT
                }, (message) => {
                    this.mPomeloState = PomeloState.INITED_SOCKET;
                    this.checkConnectoConnector(username, success, error);
                });
            }
        } else if (this.mPomeloState == PomeloState.INITED_SOCKET) {
            this.log("Try tìm gate");
            this.mPomeloState = PomeloState.CONNECTING_TO_GATE;
            window['pomelo'].request(NetworkConfig.GATE_CONNECT, { "uid": "gaodo" }, (data) => {
                if (data['code'] == 200) {
                    this.mPomeloState = PomeloState.CONNECTED_TO_GATE;
                    this.mConnectorHost = data['host'];
                    this.mConnectorPort = data['port'];
                    if (data['host'] == "127.0.0.1") {
                        this.mConnectorHost = NetworkConfig.MAIN_HOST;
                    }
                    this.checkConnectoConnector(username, success, error);
                } else {
                    error();
                }
            });
        } else if (this.mPomeloState == PomeloState.CONNECTED_TO_GATE) {
            this.mManualDisconnect = true;
            this.disconnect();
            this.log("Connect tới connector được cấp");
            this.mPomeloState = PomeloState.CONNECTING_TO_CONNECTOR;
            window['pomelo'].init({
                host: this.mConnectorHost, port: this.mConnectorPort
            }, (message) => {
                this.mManualDisconnect = false;
                this.mPomeloState = PomeloState.CONNECTED_TO_CONNECTOR;
                this.checkConnectoConnector(username, success, error);
            });
        } else if (this.mPomeloState == PomeloState.CONNECTED_TO_CONNECTOR) {
            this.log("Login vào hệ thống");
            this.mPomeloState = PomeloState.LOGINING;
            let params = ParamBuilder_Inroom.builder()
                .add(PomeloParamsKey.NAME, username)
                .add(PomeloParamsKey.PASSWORD, '')
                .add(PomeloParamsKey.PARTNER, "default")
                .add(PomeloParamsKey.LOGIN_TYPE, 0)
                .add(PomeloParamsKey.DEVICE_NAME, this.mDevice.device_name)
                .add(PomeloParamsKey.DEVICE_ID, this.mDevice.device_id)
                .add(PomeloParamsKey.PLATFORM, this.mDevice.platform)
                .add(PomeloParamsKey.VERSION, NetworkConfig.VERSION)
                .build();
            window['pomelo'].request("connector.entryHandler.login", params, (data) => {
                if (data['code'] == 200) {
                    this.mPomeloState = PomeloState.LOGINED;
                    /**Request để xác nhận user đã login vào hệ thống */
                    this.get_user_info();
                    this.checkConnectoConnector(username, success, error);
                } else {
                    error();
                }
            });
        } else {
            this.log("Đã login vào hệ thống");
            success();
        }

    }

    public sendRequest(route: string, params: any) {
        this.log("Send request " + route);
        let r = route.split('.');
        let cmd = r[1];
        if (route == NetworkConfig.ROOM_JOIN) {
            window['pomelo'].notify(route, params);
        }
        else if (r[0] == "lobby") {
            window['pomelo'].notify(NetworkConfig.LOBBY_REQUEST + cmd, params);
        }
        else if (r[0] == "room") {
            params['_cmd_'] = cmd;
            window['pomelo'].notify(NetworkConfig.ROOM_REQUEST, params);
        }
        else {
            window['pomelo'].notify(route, params);
        }
    }

    public disconnect() {
        window['pomelo'].disconnect();
    }

    public register_account(uid: string, password: string) {
    }

    public get_user_info() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.LOBBY + PomeloCmd.USER_INFO, params);
    }

    public join_room(roomname: string, pass: string) {
        let params = ParamBuilder_Inroom.builder()
            .add(PomeloParamsKey.ROOM_NAME, roomname)
            .add(PomeloParamsKey.PASSWORD, pass)
            .build();
        this.sendRequest(NetworkConfig.ROOM_JOIN, params);
    }

    public leave_room() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.LEAVE_ROOM, params);
    }

    public user_leave_room() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.USER_LEAVE_ROOM, params);
    }

    public room_info() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.ROOM_INFO, params);
    }

    public list_gift() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.LIST_GIFTS, params);
    }

    public user_join_room() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.USER_JOIN_ROOM, params);
    }

    public send_gift(gift_id: number, count: number) {
        let params = ParamBuilder_Inroom.builder()
            .add(PomeloParamsKey.GIFT_ID, gift_id)
            .add(PomeloParamsKey.NUMBER, count)
            .build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.SEND_GIFT, params);
    }

    public user_send_gift() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.USER_SEND_GIFT, params);
    }

    public receive_gift() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(NetworkConfig.CHAT_REQUEST, params);
    }

    public requestSendChat(role_id: number, avatar: string, user_id: string, content: string, user_title: string, scope: number, kind: number, room_id: string) {
        let params = ParamBuilder_Inroom.builder()
            .add(PomeloParamsKey.ID, user_id)
            .add(PomeloParamsKey.CONTENT, content)
            .add(PomeloParamsKey.FROM, user_title)
            .add(PomeloParamsKey.SCOPE, scope)
            .add(PomeloParamsKey.KIND, kind)
            .add(PomeloParamsKey.ROOMID, room_id)
            .add(PomeloParamsKey.EXTRAS, { "avatar": avatar, "role_id": role_id })
            .build();
        this.sendRequest(NetworkConfig.CHAT_REQUEST, params);
    }

    public history_chat() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.HISTORY_CHAT, params);
    }

    public follow() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.FOLLOW, params);
    }

    public unfollow() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.UNFOLLOW, params);
    }

    public ban_nick(type: number, username: string) {
        let params = ParamBuilder_Inroom.builder()
            .add(PomeloParamsKey.TYPE, type)
            .add(PomeloParamsKey.USER_NAME, username)
            .build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.BAN_NICK, params);
    }

    public banned() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.BANNED, params);
    }

    public is_fan() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.IS_FAN, params);
    }

    public grant_admin(username: string) {
        let params = ParamBuilder_Inroom.builder()
            .add(PomeloParamsKey.USER_NAME, username)
            .build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.GRANT_ADMIN, params);
    }

    public admin_granted() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.ADMIN_GRANTED, params);
    }

    public ungrant_admin(username: string) {
        let params = ParamBuilder_Inroom.builder()
            .add(PomeloParamsKey.USER_NAME, username)
            .build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.UNGRANT_ADMIN, params);
    }

    public admin_ungranted() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.ADMIN_UNGRANTED, params);
    }

    public room_list_users(offset: number, size: number) {
        let params = ParamBuilder_Inroom.builder()
            .add(PomeloParamsKey.OFFSET, offset)
            .add(PomeloParamsKey.SIZE, size)
            .build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.LIST_USERS, params);
    }

    public change_onair_state() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.CHANGE_ONAIR_STATE, params);
    }

    public change_room_state() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.CHANGE_ROOM_STATE, params);
    }

    public like() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.LIKE, params);
    }

    public unlike() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.UNLIKE, params);
    }

    public share() {
        let params = ParamBuilder_Inroom.builder().build();
        this.sendRequest(PomeloCmd.ROOM + PomeloCmd.SHARE, params);
    }

    public query_user_info(username: string) {
        let params = ParamBuilder_Inroom.builder()
            .add(PomeloParamsKey.USER_NAME, username)
            .build();
        this.sendRequest(PomeloCmd.LOBBY + PomeloCmd.QUERY_USER_INFO, params);
    }



    // ===================================== add listener for events ==========================

    addPomeloListeners() {
        this.on_io_error();
        this.on_close_error();
        this.on_get_user_info();
        this.on_join_room();
        this.on_room_info();
        this.on_query_user_info();
        this.on_leave_room();
        this.on_user_leave_room();
        this.on_list_gift();
        this.on_user_join_room();
        this.on_send_gift();
        this.on_user_send_gift();
        this.on_receive_gift();
        this.on_chat();
        this.on_history_chat();
        this.on_follow();
        this.on_un_follow();
        this.on_ban_nick();
        this.on_is_banned();
        this.on_is_fan();
        this.on_grant_admin();
        this.on_admin_granted()
        this.on_ungrant_admin();
        this.on_admin_ungranted();
        this.on_list_users();
        this.on_change_onair_state();
        this.on_change_room_state();
        this.on_like();
        this.on_unlike();
        this.on_share();
        this.on_user_like();
        this.on_user_share();
        this.on_user_follow();
    }


    on_io_error() {
        window['pomelo'].on(PomeloCmd.IO_ERROR, (data) => {
            if (!this.mManualDisconnect) this.mResponses.push(new ResponsePomelo(PomeloCmd.IO_ERROR, data));
        });
    }

    on_close_error() {
        window['pomelo'].on('disconnect', (data) => {
            if (!this.mManualDisconnect)
                this.mResponses.push(new ResponsePomelo(PomeloCmd.DISCONNECT, data));
        });
    }

    on_get_user_info() {
        window['pomelo'].on(PomeloCmd.USER_INFO, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.USER_INFO, data));
        });
    }

    on_join_room() {
        window['pomelo'].on(PomeloCmd.JOIN_ROOM, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.JOIN_ROOM, data));
        });
    }
    on_room_info() {
        window['pomelo'].on(PomeloCmd.ROOM_INFO, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.ROOM_INFO, data));
        });
    }
    on_query_user_info() {
        window['pomelo'].on(PomeloCmd.QUERY_USER_INFO, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.QUERY_USER_INFO, data));
        });
    }

    on_leave_room() {
        window['pomelo'].on(PomeloCmd.LEAVE_ROOM, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.LEAVE_ROOM, data));
        });
    }

    on_user_leave_room() {
        window['pomelo'].on(PomeloCmd.USER_LEAVE_ROOM, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.USER_LEAVE_ROOM, data));
        });
    }

    on_list_gift() {
        window['pomelo'].on(PomeloCmd.LIST_GIFTS, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.LIST_GIFTS, data));
        });
    }

    on_user_join_room() {
        window['pomelo'].on(PomeloCmd.USER_JOIN_ROOM, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.USER_JOIN_ROOM, data));
        });
    }

    on_send_gift() {
        window['pomelo'].on(PomeloCmd.SEND_GIFT, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.SEND_GIFT, data));
        });
    }

    on_user_send_gift() {
        window['pomelo'].on(PomeloCmd.USER_SEND_GIFT, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.USER_SEND_GIFT, data));
        });
    }

    on_receive_gift() {
        window['pomelo'].on(PomeloCmd.RECEIVE_GIFT, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.RECEIVE_GIFT, data));
        });
    }

    on_chat() {
        window['pomelo'].on('onChat', (data) => {
            this.mResponses.push(new ResponsePomelo('onChat', data));
        });
    }

    on_history_chat() {
        window['pomelo'].on(PomeloCmd.HISTORY_CHAT, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.HISTORY_CHAT, data));
        });
    }

    on_follow() {
        window['pomelo'].on(PomeloCmd.FOLLOW, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.FOLLOW, data));
        });
    }

    on_un_follow() {
        window['pomelo'].on(PomeloCmd.UNFOLLOW, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.UNFOLLOW, data));
        });
    }

    on_ban_nick() {
        window['pomelo'].on(PomeloCmd.BAN_NICK, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.BAN_NICK, data));
        });
    }

    on_is_banned() {
        window['pomelo'].on(PomeloCmd.BANNED, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.BANNED, data));
        });
    }

    on_is_fan() {
        window['pomelo'].on(PomeloCmd.IS_FAN, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.IS_FAN, data));
        });
    }

    on_grant_admin() {
        window['pomelo'].on(PomeloCmd.GRANT_ADMIN, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.GRANT_ADMIN, data));
        });
    }

    on_admin_granted() {
        window['pomelo'].on(PomeloCmd.ADMIN_GRANTED, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.ADMIN_GRANTED, data));
        });
    }

    on_ungrant_admin() {
        window['pomelo'].on(PomeloCmd.UNGRANT_ADMIN, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.UNGRANT_ADMIN, data));
        });
    }

    on_admin_ungranted() {
        window['pomelo'].on(PomeloCmd.ADMIN_UNGRANTED, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.ADMIN_GRANTED, data));
        });
    }

    on_list_users() {
        window['pomelo'].on(PomeloCmd.LIST_USERS, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.LIST_USERS, data));
        });
    }

    on_change_onair_state() {
        window['pomelo'].on(PomeloCmd.CHANGE_ONAIR_STATE, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.CHANGE_ONAIR_STATE, data));
        });
    }

    on_change_room_state() {
        window['pomelo'].on(PomeloCmd.CHANGE_ROOM_STATE, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.CHANGE_ROOM_STATE, data));
        });
    }

    on_like() {
        window['pomelo'].on(PomeloCmd.LIKE, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.LIKE, data));
        });
    }

    on_unlike() {
        window['pomelo'].on(PomeloCmd.UNLIKE, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.UNLIKE, data));
        });
    }

    on_share() {
        window['pomelo'].on(PomeloCmd.SHARE, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.SHARE, data));
        });
    }

    on_user_like() {
        window['pomelo'].on(PomeloCmd.USER_LIKE, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.USER_LIKE, data));
        });
    }
    on_user_share() {
        window['pomelo'].on(PomeloCmd.USER_FOLLOW, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.USER_FOLLOW, data));
        });
    }
    on_user_follow() {
        window['pomelo'].on(PomeloCmd.USER_SHARE, (data) => {
            this.mResponses.push(new ResponsePomelo(PomeloCmd.USER_SHARE, data));
        });
    }

}
